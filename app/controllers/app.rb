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

def encrypt_token_with_session(token)
  key1 = session["session_id"][0..31]
  key2 = session["session_id"][32..63]
  aes1 = FastAES.new(key1)
  aes2 = FastAES.new(key2)
  return aes2.encrypt(aes1.encrypt(token))
end

def get_auth_token
  if(session["encrypted_auth_token"] && encrypt_token_with_session(session["encrypted_auth_token"]) == session["session_encrypted_auth_token"])
    aes = FastAES.new(settings.secret_key)
    return aes.decrypt(session["encrypted_auth_token"])
  else
    return ""
  end
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
  if session["user"]
    params.merge!({"auth_token" => get_auth_token})
  end

  @search_results = JSON.parse RestClient.get (settings.domain + "/search"), params: params
  if @search_results["success"]
    @search_results = @search_results["result"]
    erb (settings.mobile+"search").to_sym
  end
end

post "/set_item/*" do
  session["item_ids"] = params[:splat][0].split("/")
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
  item_params = {"latitude" => session["latitude"], "longitude" => session["longitude"], "auth_token" => get_auth_token}
  if session["item_ids"]
    item_ids = session["item_ids"]
    # Throw back items here.  Substring the request.url from the 4th slash to either the ? or the end of the string and replace it
    qm = request.url.index("?")
    if qm == nil
      qm = request.url.length
    end
    slash = request.url.index("/",request.url.index("/",7)+1)
    new_url = request.url.sub(request.url[slash+1..qm-1],item_ids.join("/"))
  else
    item_ids = params[:splat][0].split("/")
    new_url = request.url
  end
  item_ids.each {|id|
    result = JSON.parse RestClient.get (settings.domain + "/items/" + id), params: item_params
    if result["success"]
      if (!params["min_rating"] || result["result"]["rating"].to_f >= params["min_rating"].to_f) &&
         (!params["max_distance"] || result["result"]["distance"].to_f <= params["max_distance"].to_f) &&
         (!params["min_price"] || result["result"]["prices"]["1"].to_f >= params["min_price"].to_f) &&
         (!params["max_price"] || result["result"]["prices"]["1"].to_f <= params["max_price"].to_f) &&
         (!(params["in_stock"].to_s == "true") || result["result"]["in_stock"]) &&
         (!(params["open_now"].to_s == "true") || result["result"]["open_now"])
        @item_results.push result
      else
        @filtered_results.push result["result"]["id"]
      end
    end
  }
  @similar_items = JSON.parse RestClient.get (settings.domain + "/items/similar"),
                                             params: item_params.merge({"items" => item_ids[0]})
  prev_query = session["query_string"]
  session["query_string"] = new_url
  @filtered_results.each {|id|
    session["query_string"].sub!("/" + id.to_s,"")
  }

  # Apply sort
  if params["sort"] == "Price"
    @item_results = @item_results.sort {|x,y| x["result"]["prices"]["1"] <=> y["result"]["prices"]["1"]}
  elsif params["sort"] == "Rating"
    @item_results = @item_results.sort {|x,y| y["result"]["rating"] <=> x["result"]["rating"]}
  elsif params["sort"] == "Distance"
    @item_results = @item_results.sort {|x,y| x["result"]["distance"] <=> y["result"]["distance"]}
  end

  if !@item_results.empty? && !@item_results[0].empty?
    erb (settings.mobile+"item").to_sym
  else
    session[:error] = "Please ensure your filters will provide valid results."
    redirect prev_query
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
  session["encrypted_auth_token"] = Base64.decode64(params[:encrypted_auth_token])
  session["session_encrypted_auth_token"] = encrypt_token_with_session(session["encrypted_auth_token"])
  if mobile_request?
    return
  end
  erb :user, :layout => false
end

# Mobile-specific pages
get "/sign_in/?" do
  erb "mobile/sign_in".to_sym
end