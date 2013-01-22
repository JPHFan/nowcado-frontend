#A simple partial helper, taken from:
#http://ididitmyway.heroku.com/past/2010/5/31/partials/
#call with <%= render_partial :partial_name %>
helpers do
  def render_partial(template, options={})
    erb template, options.merge({:layout => false})
  end
end
