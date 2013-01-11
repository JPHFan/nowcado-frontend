helpers do
  def sale(prices)
    return prices.reject {|k| k.to_i == 1}.map {|k,v|
        "Buy " + k.to_s + " for $" + v
      }
  end
end