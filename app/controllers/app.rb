get "/" do
	@user = {:username => "Avi"}
	erb :index
end

get "/sign_out" do
	@user = nil
	erb :index
end

get "/settings" do
	erb :settings
end
