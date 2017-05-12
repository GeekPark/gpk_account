module APIHelper
  def result
    return @result if @result
    @result = { tmp: JSON.parse(response.body) }.deep_symbolize_keys!
    @result = @result[:tmp]
  end
end
