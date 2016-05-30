module Doorkeeper
  module Helpers::Controller
    alias old get_error_response_from_exception

    def get_error_response_from_exception(exception)
      error_name = case exception
                   when Errors::TwoFactorError
                     :two_factor
                   end
      if error_name
        OAuth::ErrorResponse.new name: error_name, state: params[:state]
      else
        old exception
      end
    end
  end

  class Errors::TwoFactorError < Errors::DoorkeeperError
  end
end
