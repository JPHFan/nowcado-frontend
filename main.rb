require 'sinatra'
require 'sinatra/static_assets'
require 'sinatra/base'
require 'sinatra/assetpack'
require 'json'
require 'rest_client'
require 'profiler'
require 'sanitize'
require 'cgi'
require 'base64'
require 'mail'

configure do
  set :views, ['views/layouts', 'views/pages', 'views/partials']
  enable :sessions
  set :environment, :production
  set :production, true
  set :protection, except: :session_hijacking
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
      '/js/jquery.raty.min.js',
      '/js/holder.js',
      '/js/global_functions.js',
      '/js/bootstrap.js',
      '/js/growl.js'
    ]
    js :pre_reports, [
      '/js/flotcharts/jquery.flot.js',
      '/js/flotcharts/jquery.flot.pie.js',
      '/js/flotcharts/jquery.flot.selection.js',
      '/js/markerclusterer/markerclusterer_packed.js',
      '/js/jquery.tablesorter.min.js'
    ]
    js :post_reports, ['/js/charts_helper.js', '/js/reports.js']
    js :post_app, [
      '/js/app.js',
      '/js/jquery.ui.addresspicker.js'
    ]
    js :cart, ['/js/flotcharts/jquery.flot.js', '/js/flotcharts/jquery.flot.selection.js', '/js/cart.js', '/js/charts_helper.js', '/js/price_history.js']
    js :cart_list, ['/js/cart_list.js']
    js :index, ['/js/index.js','/js/jquery.carouFredSel-packed.js']
    js :item, ['/js/flotcharts/jquery.flot.js', '/js/flotcharts/jquery.flot.selection.js', '/js/item.js', '/js/review.js', '/js/charts_helper.js', '/js/price_history.js', '/js/load-image.js', '/js/canvas-to-blob.js',  '/js/jquery.iframe-transport.js', '/js/jquery.fileupload.js', '/js/jquery.fileupload-process.js', '/js/jquery.fileupload-image.js', '/js/jquery.fileupload-validate.js', '/js/edit_image.js', '/js/xregexp-min.js', '/js/edit_department.js', '/js/jsoneditor.js', '/js/select_store.js']
    js :add_item, ['/js/add_item.js', '/js/select_store.js', '/js/load-image.js', '/js/canvas-to-blob.js',  '/js/jquery.iframe-transport.js', '/js/jquery.fileupload.js', '/js/jquery.fileupload-process.js', '/js/jquery.fileupload-image.js', '/js/jquery.fileupload-validate.js', '/js/edit_image.js', '/js/xregexp-min.js', '/js/edit_department.js', '/js/jsoneditor.js']
    js :search, ['/js/search.js']
    js :store, ['/js/review.js']
    js :user, ['/js/user.js']

    css :application, [
        '/css/jquery-ui-1.9.2.css',
        '/css/bootstrap.min.css',
        '/css/cerulean.css',
        '/css/style.css',
        '/css/jquery.fileupload-ui.css'
    ]

    css_compression :yui
    js_compression :yui, :munge => true
    prebuild true
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
