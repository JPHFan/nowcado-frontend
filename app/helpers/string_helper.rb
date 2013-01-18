helpers do
  def cap_words(s)
    s.split(/(\s|-|\()/).map {|w| w.capitalize }.join('')
  end
end