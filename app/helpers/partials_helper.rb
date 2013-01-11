#A simple partial helper, taken from:
#http://ididitmyway.heroku.com/past/2010/5/31/partials/
#call with <%= render_partial :partial_name %>
helpers do
  def render_partial(template)
    erb template, :layout => false
  end
end
