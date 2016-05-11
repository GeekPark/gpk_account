module Warden::Mixins::Common
  def request
    @request ||= ActionDispatch::Request.new(env)
  end

  def cookies
    request.cookie_jar
  end
end
