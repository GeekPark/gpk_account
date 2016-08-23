class PermissionError < StandardError; end

class Unauthorized < StandardError; end

class VerifyCodeInvalid < StandardError; end

class ParameterValueNotAllowed < ActionController::ParameterMissing
  def initialize(param)
    @param = param
    super("param: #{param} value not allowed")
  end
end
