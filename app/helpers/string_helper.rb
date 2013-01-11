helpers do
  def cap_words(s)
    s.split(' ').map {|w| w.capitalize }.join(' ')
  end
end