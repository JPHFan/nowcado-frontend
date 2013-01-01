get "/?" do
  erb (settings.mobile+"index").to_sym
end

get "/sign_out/?" do
	session["user"] = nil
  erb (settings.mobile+"index").to_sym
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

  @search_results = JSON.parse RestClient.get (settings.domain + "/search"), params: params
  if @search_results["success"]
    @search_results = @search_results["result"]
    erb (settings.mobile+"search").to_sym
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
  session["user"] = JSON.parse params[:user_data]
  if mobile_request?
    return
  end
  erb :user, :layout => false
end

# Mobile-specific pages
get "/sign_in/?" do
  erb "mobile/sign_in".to_sym
end