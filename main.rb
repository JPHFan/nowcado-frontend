require 'sinatra'
require 'sinatra/static_assets'

configure do
  set :views, ['views/layouts', 'views/pages', 'views/partials']
  enable :sessions
end

Dir["./app/models/*.rb"].each { |file| require file }
Dir["./app/helpers/*.rb"].each { |file| require file }
Dir["./app/controllers/*.rb"].each { |file| require file }

before "/*" do 
  if mobile_request?
    set :erb, :layout => :mobile
  else
    set :erb, :layout => :layout
  end
end
