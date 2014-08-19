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

post "/feedback/?" do
  email_hash = {
    :to => 'nowcado@gmail.com',
    :subject => params[:subject],
    :body => "Email: " + params[:email] + "\n" + params[:comment],
    :from => ENV['EMAIL_USERNAME']
  }
  Mail.deliver email_hash
end

get "/api/?" do
  redirect settings.domain
end

get "/privacy/?" do
  erb (settings.mobile+"privacy").to_sym
end

get "/tos/?" do
  erb (settings.mobile+"tos").to_sym
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

post "/user/edit/?" do
  response = rest_call("/users",params,"put")
  session["user"] = response["result"]["username"].chomp('"').reverse.chomp('"').reverse if response && response["result"] && response["result"]["username"]
  return JSON.generate(response)
end

post "/set_memberships/?" do
  rest_call("/memberships",{"memberships" => params[:memberships]},"post")
end

def rest_call(address, params = {}, verb="get", domain=settings.domain)
  if session["user"]
    params.merge!({"email" => session["email"], "auth_token" => session["auth_token"], "ssid" => session["ssid"]})
  end
  params.merge!({"remote_ip" => request.ip})
  json_types = {:content_type => :json, :accept => :json}
  if verb.match(/put/i)
    result = JSON.parse RestClient.put (domain + address.to_s), params, json_types
  elsif verb.match(/post/i)
    result = JSON.parse RestClient.post (domain + address.to_s), params, json_types
  elsif verb.match(/delete/i)
    result = JSON.parse RestClient.delete (domain + address.to_s), params: params
  else
    # Assume get
    result = JSON.parse RestClient.get (domain + address.to_s), params: params
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

  if(params[:search].to_s.empty?)
    params.delete("search")
  else
    get_or_set_session_var(params, ("search").to_sym)
  end
  # Format the price string so it looks pretty for the user.
  if(params[:min_price] && params[:min_price] != "")
    params[:min_price] = "%.2f" % params[:min_price].to_f
  else
    params.delete("price_min")
  end
  if(params[:max_price] && params[:max_price] != "")
    params[:max_price] = "%.2f" % params[:max_price].to_f
  else
    params.delete("price_max")
  end
  # Update params for in_stock and open_now if set to false
  if params[:in_stock] == "false"
    params.delete("in_stock")
  end
  if params[:open_now] == "false"
    params.delete("open_now")
  end

  if params[:applied_filters] && params[:pf]
    if params[:applied_filters] != ""
      params["department[applied_filters]"] = params[:applied_filters]
    else
      params["department[applied_filters]"] = "{}"
    end
    params.delete("applied_filters")
  elsif params[:multiple_selections] && params[:multiple_selections] != "[]"
    params["department[multiple_selections]"] = params[:multiple_selections]
    params.delete("multiple_selections")
  end

  if params[:selected]
    params["department[selected]"] = params[:selected]
    params.delete("selected")
  end

  # Set up initial @prev_applied_filters, and append to it later
  if params[:multiple_selections] && params[:multiple_selections] != "[]"
    begin
      @prev_applied_filters = JSON.parse(params[:multiple_selections].to_s.gsub("=>",":"))
    rescue
      @prev_applied_filters = nil
    end
  end

  @search_results = rest_call("/search", params)
  if @search_results["success"]
    @search_results = @search_results["result"]
    @departments = @search_results["filters"]["department"] if @search_results && @search_results["filters"]
    if @departments
      if @departments["applied_filters"] 
        @applied_filters = @departments["applied_filters"].to_s.gsub("=>",":")
      end
      if params["department[selected]"] && !params["department[multiple_selections]"]
        new_valid_selections = JSON.parse(params["department[selected]"])
        if @departments["valid_selections"]
          if new_valid_selections.is_a?(Array)
            @departments["valid_selections"] += new_valid_selections
          else
            @departments["valid_selections"].push(new_valid_selections)
          end
        else
          @departments["valid_selections"] = [new_valid_selections]
        end
      end
      if @departments["valid_selections"]
        p "@departments[\"valid_selections\"]: "
        p @departments["valid_selections"]
        temp_prev_applied_filters = @departments["valid_selections"]
        if @prev_applied_filters
          @prev_applied_filters += temp_prev_applied_filters
        else
          @prev_applied_filters = temp_prev_applied_filters
        end
        p "@prev_applied_filters: "
        p @prev_applied_filters
      end
    end

    # Remove any empty hashes in prev_applied_filters
    if @prev_applied_filters && @prev_applied_filters.length > 0
      @prev_applied_filters.select! {|filter| !filter.empty? }
    end

    erb (settings.mobile+"search").to_sym
  end
end

get "/store/:id/:offset_mins/?" do
  # Get relevant reviews
  @reviews = rest_call("/stores/reviews", {"store_id" => params[:id]})
  @store = rest_call("/stores/#{params[:id]}",{"offset_mins" => params[:offset_mins]})
  erb (settings.mobile+"store").to_sym
end

get "/store/unlisted/?" do
  @store = rest_call("/maps/api/place/textsearch/json", params.merge({
    sensor: true,
    key: ENV['GOOGLE_PLACES_API_KEY'],
    radius: 1000
  }),
  "GET", "https://maps.googleapis.com")
  JSON.generate(@store)
end

get "/item/add/?" do
  if(!get_or_set_session_var(params, ("latitude").to_sym) || !get_or_set_session_var(params, ("longitude").to_sym))
    redirect '/?fail=true'
    return
  end
  erb (settings.mobile+"item_add").to_sym
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

  if result["success"]
    result["result"].each {|item|
      @item_results.push item
    }
  end

  #@similar_items = rest_call("/items/similar", item_params.merge({"items" => item_ids[0]}))
  session["query_string"] = request.url

  add_to_stores_hash(@store_ids, session["latitude"], session["longitude"])

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

    # Get similar items
    @similar_results = rest_call("/items/"+item_id.to_s+"/similar", {})["result"]

    # Get history
    history = rest_call("/items/"+item_id.to_s+"/history", {})["result"]

    # Get item name history
    @item_name_history = history["name"]

    # Get department history
    @item_dept_history = history["department"]

    # Get image history
    @item_img_history = history["image"]

    # Generate current department string
    @department_strings = get_department_strings(@item_results[0]["department"])
    
    erb (settings.mobile+"item").to_sym
  end
end

post "/item/:id/department/?" do
  return JSON.generate(rest_call("/items/" + params[:id],params,"put"))
end

def get_department_strings(children)
  arr = []
  dfs(children, []) do |path,str,dotted|
    arr.push([path.length,str,path,dotted])
  end
  return arr
end

def dfs(obj, path, &blk)
  case obj
  when Hash
    obj.each{|k,v|
      dotted = k[0]=='.'
      blk.call(path.dup,dotted ? k[1..-1]:k,dotted)
      dfs(v,path.dup << k,&blk)
    }
  when Array
    obj.each{|v|
      dfs(v, path.dup, &blk)
    }
  else
    blk.call(path.dup,obj,false)
  end
  return path
end

post "/items/?" do
  return JSON.generate(rest_call("/items/", params, "put"))
end

post "/item/?" do
  return JSON.generate(rest_call("/items/", params, "post"))
end

get "/item/img/url/?" do
  # Return {files: binary} for url param
  return JSON.generate({:fail => "No url provided"}) if !params[:url] || !(params[:url].is_a? (String))
  return JSON.generate({:fail => "Invalid url provided"}) if !(params[:url].match(/(\.|\/)(gif|jpe?g|png|bmp)$/i))
  begin
    file = RestClient.get params[:url], {:content_type => :json, :accept => :json}
    file = Base64.encode64(file.to_s) 
    return file
  rescue
    return JSON.generate({:fail => "Could not retrieve this image"})
  end
end

post "/item/:id/img/?" do
  return JSON.generate(rest_call("/items/" + params[:id] + "/img",params,"put"))
end

get "/item/:id/price/?" do
  return JSON.generate(rest_call("/items/" + params[:id] + "/price_history",params))
end

post "/item/:id/price/?" do
  return JSON.generate(rest_call("/items/" + params[:id],params,"put"))
end

post "/item/:id/name/?" do
  return JSON.generate(rest_call("/items/" + params[:id],params,"put"))
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

post "/cart/temp/add/?" do
  session["t_c"] = {} if session["t_c"].nil?
  session["t_c"][params[:id]] = params[:name]
end

post "/cart/temp/remove/?" do
  session["t_c"].delete params[:id] unless session["t_c"].nil?
end

post "/cart/items/?" do
  json = rest_call("/cart/item?ids=" + params[:ids].to_s,{},"post")
  session["t_c"] = {} if json["success"]
  return JSON.generate(json)
end

post "/cart/item/:id/?" do
  return JSON.generate({"success" => false, "message" => "You must sign in to access cart functions."}) if !session["user"]
  json = rest_call("/cart/item/" + params[:id].to_s,params,"post")
  calc_cart(params)
  return JSON.generate(json)
end

put "/cart/item/:id/?" do
  return JSON.generate({"success" => false, "message" => "You must sign in to access cart functions."}) if !session["user"]
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
    $stores_hash_history = {}
  end
  
  temp_stores_arr = []
  session["store_distances"] = {} if session["store_distances"].nil?
  
  store_ids.each{|store_id|
    # Update stores if we have no entry, no history as to when we last updated the entry, or the entry is over 1 day old.
    if (!$stores_hash.has_key?(store_id) || !$stores_hash_history.has_key?(store_id) || 
        (Time.now.utc - $stores_hash_history[store_id] > 86400))
      temp_stores_arr.push(store_id)  
    end
  }
  
  if !temp_stores_arr.empty?
    result = rest_call("/stores",{store_ids: temp_stores_arr})
    if result["success"]
      store_results_hash = result["result"]
      store_results_hash.each {|store_hash|
        store_id = store_hash["id"].to_i
        $stores_hash[store_id] = {
          "name" => store_hash["name"],
          "address" => store_hash["address"],
          "latitude" => store_hash["latitude"],
          "longitude" => store_hash["longitude"]
        }
        $stores_hash_history[store_id] = Time.now.utc
      }
    end
  end
  
  store_ids.each{|store_id|
    if session["store_distances"][store_id].nil?
      session["store_distances"][store_id] = distance_between(
        [$stores_hash[store_id]["latitude"], $stores_hash[store_id]["longitude"]], [latitude, longitude])
    end
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

post "/cart/email" do
  return JSON.generate(rest_call("/cart/itinerary/email",{},"post"))
end

get "/cart_list/?" do
  if(!get_or_set_session_var(params, ("latitude").to_sym) || !get_or_set_session_var(params, ("longitude").to_sym))
    redirect '/?fail=true'
    return
  end
  return 401 unless session["user"]
  @similar_items = {}
  @item_names = {}
  @cart = rest_call("/cart", {})["result"]
  if !@cart.nil?
    @cart.each {|item_ids, items_array|
      item_id = item_ids.split(",")[0]
      @similar_items[item_id] = rest_call("/items/"+item_id+"/similar", {})["result"]
      @item_names[item_id] = items_array[0]["name"]
    }
  end
  erb (settings.mobile+"cart_list").to_sym
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
  session["store_distances"] = {}
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
