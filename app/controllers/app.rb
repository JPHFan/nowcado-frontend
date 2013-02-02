get "/?" do
  erb (settings.mobile+"index").to_sym
end

get "/api/?" do
  redirect settings.domain
end

get "/sign_out/?" do
  session["encrypted_auth_token"] = session["user"] = nil
  erb (settings.mobile+"index").to_sym
end

get "/user/?" do
  @memberships = rest_call("/memberships/all")
  @user_memberships = rest_call("/memberships")
  erb (settings.mobile+"user").to_sym
end

post "/set_memberships/?" do
  rest_call("/memberships",{"memberships" => params[:memberships]},"post")
end

def get_auth_token
  if(session["encrypted_auth_token"])
    aes = FastAES.new(settings.secret_key)
    return aes.decrypt(session["encrypted_auth_token"])
  else
    return ""
  end
end

def rest_call(address, params = {}, verb="get")
  if session["user"]
    params.merge!({"auth_token" => get_auth_token})
  end
  json_types = {:content_type => :json, :accept => :json}
  if verb == "put"
    result = JSON.parse RestClient.put (settings.domain + address.to_s), params, json_types
  elsif verb == "post"
    result = JSON.parse RestClient.post (settings.domain + address.to_s), params, json_types
  elsif verb == "delete"
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
    session[:query_string] = request.url
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
    erb (settings.mobile+"search").to_sym
  end
end

get "/store/:id/:offset_mins/?" do
  # Get relevant reviews
  @reviews = rest_call("/store_reviews", {"store_id" => params[:id]})
  @store = rest_call("/stores/#{params[:id]}",{"offset_mins" => params[:offset_mins]})
  erb (settings.mobile+"store").to_sym
end

post "/set_item/*" do
  session["item_ids"] = params[:splat][0].split("/")
end

post "/set_qty/:item/:quantity/?" do
  rest_call("/cart",params,"post")
  get_cart
end

get "/item/*" do
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
  @filtered_results = []
  item_params = {"latitude" => session["latitude"], "longitude" => session["longitude"]}
  if session["item_ids"]
    item_ids = session["item_ids"]
    # Throw back items here.  Substring the request.url from the 4th slash to either the ? or the end of the string and replace it
    qm = request.url.index("?")
    if qm == nil
      qm = request.url.length
    end
    slash = request.url.index("/",request.url.index("/",7)+1)

    new_url = request.url.sub("/item/#{request.url[slash+1..qm-1]}","/item/#{item_ids.join("/")}")
  else
    item_ids = params[:splat][0].split("/")
    new_url = request.url
  end

  result = rest_call("/items",{:item_ids => item_ids}.merge(item_params))

  if result["success"]
    result["result"].each {|item|
      if (!params["min_rating"] || item["rating"].to_f >= params["min_rating"].to_f) &&
         (!params["max_distance"] || item["distance"].to_f <= params["max_distance"].to_f) &&
         (!params["min_price"] || item["prices"]["1"].to_f >= params["min_price"].to_f) &&
         (!params["max_price"] || item["prices"]["1"].to_f <= params["max_price"].to_f) &&
         (!(params["in_stock"].to_s == "true") || item["in_stock"]) &&
         (!(params["open_now"].to_s == "true") || item["open_now"])
        @item_results.push item
      else
        @filtered_results.push item["id"]
      end
    }
  end

  @similar_items = rest_call("/items/similar", item_params.merge({"items" => item_ids[0]}))
  prev_query = session["query_string"]
  session["query_string"] = new_url
  @filtered_results.each {|id|
    session["query_string"].sub!("/" + id.to_s,"")
  }

  # Apply sort
  if params["sort"] == "Price"
    @item_results = @item_results.sort {|x,y| x["prices"]["1"].to_f <=> y["prices"]["1"].to_f}
  elsif params["sort"] == "Rating"
    @item_results = @item_results.sort {|x,y| y["rating"].to_f <=> x["rating"].to_f}
  elsif params["sort"] == "Distance"
    @item_results = @item_results.sort {|x,y| x["distance"].to_f <=> y["distance"].to_f}
  end

  if !@item_results.empty? && !@item_results[0].empty?
    # Get relevant reviews
    @reviews = rest_call("/item_reviews", {"item_ids" =>
                                           @item_results.map {|result| result["id"]}})
    erb (settings.mobile+"item").to_sym
  else
    session[:error] = "Ensure filters provide valid results"
    redirect prev_query
  end
end

post "/toggle_helpful/:type/:id/?" do
  toggle_feedback_action(params,"toggle_helpful")
end

post "/toggle_unhelpful/:type/:id/?" do
  toggle_feedback_action(params,"toggle_unhelpful")
end

post "/toggle_inappropriate/:type/:id/?" do
  toggle_feedback_action(params,"flag_review")
end

post "/edit/:type/:id/?" do
  erb (settings.mobile+"edit_review").to_sym, :locals => {:rating => params[:rating],:review => params[:review], :id => params[:id], :type => params[:type].gsub("_review","")},:layout => false
end

post "/update/:type/:id/?" do
  modify_review("update")
end

post "/create/:type/:id/?" do
  modify_review("create")
end

post "/remove/:type/:id/?" do
  item_or_store_action(params,"","delete")
end

post "/cart/?" do
  rest_call("/cart",params,"post")
  get_cart
end

get "/cart/?" do
  get_cart
end

post "/set_qty/:item/:quantity/?" do
  rest_call("/cart",params,"post")
  get_cart
end

post "/set_cart_preferences/?" do
  rest_call("/cart/set_preferences",params,"post")
end

def get_cart
  if(!get_or_set_session_var(params, ("latitude").to_sym) || !get_or_set_session_var(params, ("longitude").to_sym))
    redirect '/?fail=true'
    return
  end
  @cart = rest_call("/stores/pick_stores",{"latitude"=>session["latitude"],"longitude"=>session["longitude"]})
  if @cart["result"]
    @cart = @cart["result"]
    @item_results = @cart[0]
  else
    @cart_error = @cart["message"]
  end

  erb (settings.mobile+"cart").to_sym
end

def modify_review(type)
  params["review"] = {"review_text" => params[:review], "rating" => params[:rating]}
  # Type is either "create" or "update"
  if type == "create"
    verb = "post"
    if params[:type].to_s.match(/store/i)
      params["review"].merge!({"store_id" => params[:id]})
    else
      params["review"].merge!({"item_id" => params[:id]})
    end
    params[:id] = nil
  else
    verb = "put"
  end

  review = item_or_store_action(params,"",verb)
  if review["success"]
    return ({:success => true, :result => (erb :show_review, :locals => {:review => review["result"], :type => params[:type].gsub("_review","")}, :layout => false)}).to_json
  else
    return review.to_json
  end
end

def toggle_feedback_action(params, toggle_action)
  item_or_store_action(params,toggle_action,"put")
end

def item_or_store_action(params, action, verb)
  type = "item"
  if params[:type].to_s.match(/store/i)
    type = "store"
  end
  if params[:id].nil?
    rest_call("/#{type}_reviews/",params,verb)
  else
    rest_call("/#{type}_reviews/#{params[:id].to_s}/#{action}",params,verb)
  end
end

def get_or_set_session_var(params, session_var_sym)
  if params[session_var_sym].to_s.empty?
    if session[session_var_sym].to_s.empty?
      return false
    else
      params[session_var_sym] = session[session_var_sym]
    end
  else
    session[session_var_sym] = params[session_var_sym]
  end
  return true
end

def set_location(params)
  session["latitude"] = params[:latitude].to_f
  session["longitude"] = params[:longitude].to_f
end

# Partials
get "/user_bar/:user_data/?" do
  session["user"] = params[:user_data].chomp('"').reverse.chomp('"').reverse
  session["encrypted_auth_token"] = params[:encrypted_auth_token]
  if mobile_request?
    return
  end
  erb :user_bar, :layout => false
end

# Mobile-specific pages
get "/sign_in/?" do
  erb "mobile/sign_in".to_sym
end