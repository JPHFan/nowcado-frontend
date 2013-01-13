require 'sinatra'
require 'sinatra/static_assets'
require 'json'
require 'rest_client'
require 'fast-aes'
require 'base64'

configure do
  set :views, ['views/layouts', 'views/pages', 'views/partials']
  enable :sessions
  if settings.production?
    set :domain, "https://nowcado.com"
  else
    set :domain, "https://127.0.0.1:3000"
  end
  set :secret_key, File.read('secret-key').strip
end

Dir["./app/models/*.rb"].each { |file| require file }
Dir["./app/helpers/*.rb"].each { |file| require file }
Dir["./app/controllers/*.rb"].each { |file| require file }

before "/*" do 
  if mobile_request?
    set :mobile, "mobile/"
    set :erb, :layout => :mobile
  else
    set :mobile, ""
    set :erb, :layout => :layout
  end
end
