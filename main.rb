require 'sinatra'
require 'sinatra/static_assets'
require 'json'
require 'rest_client'
require 'profiler'
require 'sanitize'
require 'cgi'

configure do
  set :views, ['views/layouts', 'views/pages', 'views/partials']
  enable :sessions
  set :production, true
  if settings.production?
    set :domain, "https://be2.nowcado.com"
  else
    set :domain, "https://127.0.0.1:3000"
  end
  #set :secret_key, File.read('secret-key').strip

  set :mobile, ""
  set :erb, :layout => :layout
end

Dir["./app/models/*.rb"].each { |file| require file }
Dir["./app/helpers/*.rb"].each { |file| require file }
Dir["./app/controllers/*.rb"].each { |file| require file }

before "/" do
  if android_request?
    # Prompt user to go to android page
    session["android"] = true
  elsif ios_request?
    # Prompt user to go to ios page
    session["ios"] = true
  end
end
