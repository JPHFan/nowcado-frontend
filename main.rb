require 'sinatra'
require 'sinatra/static_assets'
require 'sinatra/base'
require 'sinatra/assetpack'
require 'json'
require 'rest_client'
require 'profiler'
require 'sanitize'
require 'cgi'
require 'mail'

configure do
  set :views, ['views/layouts', 'views/pages', 'views/partials']
  enable :sessions
  set :environment, :production
  set :production, true
  if settings.production?
    set :domain, "https://be2.nowcado.com"
  else
    set :domain, "http://127.0.0.1:3000"
  end
  #set :secret_key, File.read('secret-key').strip

  set :mobile, ""
  set :erb, :layout => :layout

  Mail.defaults do
    delivery_method :smtp, {
      :address => 'smtp.gmail.com',
      :port => 587,
      :enable_starttls_auto => true,
      :user_name => ENV['EMAIL_USERNAME'],
      :password => ENV['EMAIL_PASSWORD'],
      :authentication => :plain
    }
  end

  set :root, File.dirname(__FILE__)
  Sinatra::Application.register Sinatra::AssetPack
  assets {
    serve '/js', from: 'public/js'
    serve '/css', from: 'public/css'

    js :pre_app, [
      '/js/bootstrap.min.js',
      '/js/jquery.raty.min.js',
      '/js/holder.js',
      '/js/global_functions.js'
    ]
    js :pre_reports, [
      '/js/flotcharts/jquery.flot.js',
      '/js/flotcharts/jquery.flot.pie.js',
      '/js/flotcharts/jquery.flot.selection.js',
      '/js/markerclusterer/markerclusterer_packed.js',
      '/js/jquery.tablesorter.min.js'
    ]
    js :post_reports, ['/js/reports.js']
    js :post_app, [
      '/js/app.js',
      '/js/jquery.ui.addresspicker.js',
      '/js/bootstrap.min.js'
    ]
    js :cart, ['/js/cart.js']
    js :cart_list, ['/js/cart_list.js']
    js :index, ['/js/index.js']
    js :item, ['/js/item.js', '/js/search.js', '/js/review.js']
    js :search, ['/js/search.js']
    js :store, ['/js/review.js']
    js :user, ['/js/user.js']

    css :application, [
        '/css/bootstrap.min.css',
        '/css/cerulean.css',
        '/css/style.css'
    ]

    css_compression :yui
    js_compression :closure, :level => "SIMPLE_OPTIMIZATIONS"
  }

end

Dir["./app/models/*.rb"].each { |file| require file }
Dir["./app/helpers/*.rb"].each { |file| require file }
Dir["./app/controllers/*.rb"].each { |file| require file }

#before "/" do
#  if android_request?
#    # Prompt user to go to android page
#    session["android"] = true
#  elsif ios_request?
#    # Prompt user to go to ios page
#    session["ios"] = true
#  end
#end
