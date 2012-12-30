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
  set_location(params)
  @search_results = JSON.parse RestClient.get (settings.domain + "/search"), params: params
  if @search_results["success"]
    @search_results = @search_results["result"]
    erb (settings.mobile+"search").to_sym
  end
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