# Error codes
error 401 do
  erb (settings.mobile+"errors/401").to_sym
end

get "/?" do
  if android_request?
    # Prompt user to go to android page
    session["android"] = true if session["android"].nil?
  elsif ios_request?
    # Prompt user to go to ios page
    session["ios"] = true if session["ios"].nil?
  end
  erb (settings.mobile+"index").to_sym
end

get "/api/?" do
  redirect settings.domain
end

get "/sign_out/?" do
  session["email"] = session["auth_token"] = session["ssid"] = session["user"] = nil
  erb (settings.mobile+"index").to_sym
end

get "/user/?" do
  401 unless session["user"]
  @memberships = rest_call("/memberships/all")
  @user_memberships = rest_call("/memberships")
  erb (settings.mobile+"user").to_sym
end

post "/set_memberships/?" do
  rest_call("/memberships",{"memberships" => params[:memberships]},"post")
end

def rest_call(address, params = {}, verb="get")
  if session["user"]
    params.merge!({"email" => session["email"], "auth_token" => session["auth_token"], "ssid" => session["ssid"]})
  end
  params.merge!({"remote_ip" => request.ip})
  json_types = {:content_type => :json, :accept => :json}
  if verb.match(/put/i)
    result = JSON.parse RestClient.put (settings.domain + address.to_s), params, json_types
  elsif verb.match(/post/i)
    result = JSON.parse RestClient.post (settings.domain + address.to_s), params, json_types
  elsif verb.match(/delete/i)
    result = JSON.parse RestClient.delete (settings.domain + address.to_s), params: params
  else
    # Assume get
    result = JSON.parse RestClient.get (settings.domain + address.to_s), params: params
  end

  return result
end

get "/settings/?" do
  erb (settings.mobile+"settings").to_sym
end

post "/set_location/?" do
  set_location(params)
end

get "/search/?" do
  # Refresh the query string based on the params that have been previously set, provided they include the required entries
  if(params[:latitude] && params[:longitude] && params[:search])
    session["query_string"] = request.url
  end
  if(!get_or_set_session_var(params, ("latitude").to_sym) || !get_or_set_session_var(params, ("longitude").to_sym))
    redirect '/?fail=true'
    return
  end
  if(!get_or_set_session_var(params, ("search").to_sym))
    params[:search] = ""
  end
  # Format the price string so it looks pretty for the user.
  if(params[:min_price] && params[:min_price] != "")
    params[:min_price] = "%.2f" % params[:min_price].to_f
  else
    params.delete("min_price")
  end
  if(params[:max_price] && params[:max_price] != "")
    params[:max_price] = "%.2f" % params[:max_price].to_f
  else
    params.delete("max_price")
  end
  # Update params for in_stock and open_now if set to false
  if params[:in_stock] == "false"
    params.delete("in_stock")
  end
  if params[:open_now] == "false"
    params.delete("open_now")
  end
  departments = params.select {|k,v| v=="true" && k.match(/department_/i)}.map {|k,v| k[11..-1]}
  if !departments.empty?
    params["departments"] = departments
  end

  @search_results = rest_call("/search", params.reject {|k,v| k.match(/department_/i)})
  if @search_results["success"]
    @search_results = @search_results["result"]
    @search_results["facets"] = [] if @search_results["facets"].nil?
    erb (settings.mobile+"search").to_sym
  end
end

get "/store/:id/:offset_mins/?" do
  # Get relevant reviews
  @reviews = rest_call("/stores/reviews", {"store_id" => params[:id]})
  @store = rest_call("/stores/#{params[:id]}",{"offset_mins" => params[:offset_mins]})
  erb (settings.mobile+"store").to_sym
end

get "/item/:id/?" do
  if(!get_or_set_session_var(params, ("latitude").to_sym) || !get_or_set_session_var(params, ("longitude").to_sym))
    redirect '/?fail=true'
    return
  end

  @search_results = {"facets" => {
                        "rating" =>
                          {"_type" => "range", "ranges" => [{"to"=>2.0},{"from"=>2.0},{"from"=>3.0},{"from"=>4.0},{"from"=>5.0}]},
                        "distance" =>
                          {"_type" => "geo_distance", "ranges" => [{"to"=>1.0},{"to"=>5.0},{"to"=>10.0},{"to"=>20.0},{"to"=>50.0}]}
                      }
                    }

  @item_results = []
  item_params = {"latitude" => session["latitude"], "longitude" => session["longitude"]}
  @store_ids = params[:store_ids].to_s.gsub(/[\[\]\"\'\\\s]/,"").split(",").map {|val| val.to_i}
  item_id = params[:id].to_i

  result = rest_call("/items/" + item_id.to_s, {:store_ids => CGI.unescape(params[:store_ids].to_s)}.merge(item_params))

  puts "result: #{result}"

  if result["success"]
    result["result"].each {|item|
      @item_results.push item
    }
  end

  #@similar_items = rest_call("/items/similar", item_params.merge({"items" => item_ids[0]}))
  session["query_string"] = request.url

  add_to_stores_hash(@store_ids, session["latitude"], session["longitude"])

  puts "@item_results: #{@item_results}"
  puts "$stores_hash: #{$stores_hash}"

  # Apply sort
  if params["sort"] == "Price"
    @item_results = @item_results.sort {|x,y| x["prices"]["1"].to_f <=> y["prices"]["1"].to_f}
  elsif params["sort"] == "Rating"
    @item_results = @item_results.sort {|x,y| y["rating"].to_f <=> x["rating"].to_f}
  elsif params["sort"] == "Distance"
    @item_results = @item_results.sort {|x,y| session["store_distances"][x["store_id"]] <=> session["store_distances"][y["store_id"]]}
  end

  if !@item_results.empty? && !@item_results[0].empty?
    # Get relevant reviews
    @reviews = rest_call("/items/"+item_id.to_s+"/reviews", { :store_ids => CGI.unescape(params[:store_ids].to_s) })
    
    erb (settings.mobile+"item").to_sym
  end
end

post "/toggle_helpful/:type/:id/:review_id/?" do
  toggle_feedback_action(params,"toggle_helpful")
end

post "/toggle_unhelpful/:type/:id/:review_id/?" do
  toggle_feedback_action(params,"toggle_unhelpful")
end

post "/toggle_inappropriate/:type/:id/:review_id/?" do
  toggle_feedback_action(params,"flag_review")
end

post "/edit/:type/:id/?" do
  erb (settings.mobile+"edit_review").to_sym, :locals => {:rating => params[:rating], :review => params[:review], :id => params[:id], :review_id => params[:review_id], :type => params[:type].gsub("_review","")},:layout => false
end

post "/update/:type/:id/:review_id/?" do
  modify_review("update")
end

post "/create/:type/:id/?" do
  modify_review("create")
end

post "/remove/:type/:id/:review_id/?" do
  item_or_store_action(params,"","delete")
end

post "/cart/item/:id/?" do
  json = rest_call("/cart/item/" + params[:id].to_s,params,"post")
  calc_cart(params)
  return JSON.generate(json)
end

put "/cart/item/:id/?" do
  json = rest_call("/cart/item/" + params[:id].to_s,params,"put")
  get_cart(params)
  return JSON.generate(json)
end

get "/cart/item/:name/?" do
  params[:sort] = nil
  params[:search] = CGI.unescape(params[:name])
  @search_results = rest_call("/search", params)
  if @search_results["success"]
    @search_results = @search_results["result"]
    # Assume the exact name search will return the correct item first, when sorted by relevancy (the default).
    store_ids = @search_results["results"][0]["children_results"].map{|c| c["store_id"]}
    item_id = @search_results["results"][0]["_id"]
    redirect "/item/#{item_id}?store_ids=#{CGI.escape(store_ids.to_s.gsub(" ",""))}"
  else
    redirect '/?fail=true'
  end
end

get "/cart/?" do
  get_cart(params)
end

put "/cart/preferences/?" do
  json = rest_call("/cart/preferences",params,"put")
  return JSON.generate(json)
end

get "/cart/itinerary/?" do
  json = lookup_itinerary
  return JSON.generate(json)
end

def add_to_stores_hash(store_ids, latitude=nil, longitude=nil)
  if $stores_hash.nil?
    $stores_hash = {}
  end
  store_ids.each{|store_id|
    if !$stores_hash.has_key?(store_id)
      result = rest_call("/stores/"+store_id.to_s)
      if result["success"]
        store_hash = result["result"]
        $stores_hash[store_id] = {
          "name" => store_hash["name"],
          "address" => store_hash["address"],
          "latitude" => store_hash["latitude"],
          "longitude" => store_hash["longitude"]
        }
      end
    end

    session["store_distances"] = {} if session["store_distances"].nil?
    session["store_distances"][store_id] = distance_between(
        [$stores_hash[store_id]["latitude"], $stores_hash[store_id]["longitude"]], [latitude, longitude])
  }
end

def calc_cart(params={})
  if(!get_or_set_session_var(params, ("latitude").to_sym) || !get_or_set_session_var(params, ("longitude").to_sym))
    redirect '/?fail=true'
    return
  end
  rest_call("/cart/itinerary",{"latitude"=>session["latitude"],"longitude"=>session["longitude"],
                               "session_id"=>session["session_id"]},
            "put")
end

def lookup_itinerary
  json = rest_call("/cart/itinerary")
  #p "results from lookup_itinerary: #{json}"
  return json
end

def get_cart(params)
  calc_cart(params)

  @cart = lookup_itinerary

  if @cart["result"]
    @cart = @cart["result"]
    @cart_error = nil

    add_to_stores_hash(@cart["path"].map{|s| s["id"]}, session["latitude"], session["longitude"])
  else
    # This may be a failure message or a wait message.
    @cart_error = @cart["message"]
  end

  erb (settings.mobile+"cart").to_sym
end

def modify_review(type)
  params["review"] = {"review_text" => CGI.unescape(params[:review]), "rating" => params[:rating]}
  # Type is either "create" or "update"
  if type == "create"
    verb = "post"
  else
    verb = "put"
  end

  review = item_or_store_action(params,"",verb)
  if review["success"]
    return ({:success => true, :result => (erb :show_review, :locals => {:review => review["result"], :type => params[:type].gsub("_review",""), :parent_id => params[:id]}, :layout => false)}).to_json
  else
    return review.to_json
  end
end

def toggle_feedback_action(params, toggle_action)
  params.delete(:review)
  params.delete(:rating)
  item_or_store_action(params,toggle_action,"post").to_json
end

def item_or_store_action(params, action, verb)
  type = "items"
  if params[:type].to_s.match(/store/i)
    type = "stores"
  end
  if params[:review_id].nil?
    rest_call("/#{type}/#{params[:id]}/reviews",params,verb)
  else
    rest_call("/#{type}/#{params[:id]}/reviews/#{params[:review_id].to_s}/#{action}",params,verb)
  end
end

def get_or_set_session_var(params, session_var_sym)
  if params[session_var_sym].to_s.empty?
    if session[session_var_sym.to_s].to_s.empty?
      return false
    else
      params[session_var_sym] = session[session_var_sym.to_s]
    end
  else
    session[session_var_sym.to_s] = params[session_var_sym]
  end
  return true
end

def set_location(params)
  session["latitude"] = params[:latitude].to_f
  session["longitude"] = params[:longitude].to_f
end

# Takes two points in form [lat,lon]
def distance_between(point1, point2)
  point1 = to_radians(point1)
  point2 = to_radians(point2)

  dlat = point2[0] - point1[0]
  dlon = point2[1] - point1[1]

  a = (Math.sin(dlat / 2))**2 + Math.cos(point1[0]) *
      (Math.sin(dlon / 2))**2 * Math.cos(point2[0])
  c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a))
  # This is the radius of the earth converted to miles
  return c * 6371.0 * 0.621371192
end

def to_radians(*args)
  args = args.first if args.first.is_a?(Array)
  if args.size == 1
    args.first.to_f * (Math::PI / 180)
  else
    args.map{ |i| to_radians(i)}
  end
end

# Store report calls
get "/reports/?" do
  # Do a second authentication to confirm the user is a store owner to see the reports
  auth_test = rest_call("/users/sign_in")
  error 401 unless auth_test["success"] && auth_test["result"]["store_owner"]
  @stores = rest_call("/stores")["result"]
  erb (settings.mobile+"reports").to_sym
end

get "/reports/loyalty/?" do
  json = rest_call("/reports/rating_history", {:store_ids => params[:store_ids]}, "get")
  if json["success"]
    return JSON.generate(json)
  else
    return JSON.generate(json)
  end
end

get "/reports/wins/?" do
  json = rest_call("/reports/wins", {:store_ids => params[:store_ids]}, "get")
  if json["success"]
    return JSON.generate(json)
  else
    return JSON.generate(json)
  end
end

get "/reports/top_sellers/?" do
  json = rest_call("/reports/top_sellers", params, "get")
  if json["success"]
    return JSON.generate(json)
  else
    return JSON.generate(json)
  end
end

# Partials
get "/user_bar/:user_data/?" do
  session["user"] = params[:user_data].chomp('"').reverse.chomp('"').reverse
  session["email"] = params[:email]
  session["auth_token"] = params[:auth_token]
  session["ssid"] = params[:ssid]
  session["store_owner"] = (params[:store_owner] == "true")
  if mobile_request?
    return
  end
  erb :user_bar, :layout => false
end

# Mobile-specific pages
get "/sign_in/?" do
  erb "mobile/sign_in".to_sym
end
