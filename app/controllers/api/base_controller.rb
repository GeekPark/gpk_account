module Api
  class BaseController < ActionController::API
    include ActionController::Serialization

    rescue_from(ActionController::ParameterMissing) do |err|
      render json: { error: 'ParameterInvalid', message: err }, status: 400
    end
    rescue_from(ActiveRecord::RecordInvalid) do |err|
      render json: { error: 'RecordInvalid', message: err }, status: 400
    end
    rescue_from(ActiveRecord::RecordNotFound) do
      render json: { error: 'ResourceNotFound' }, status: 404
    end

    private

    def current_user
      User.find(doorkeeper_token.resource_owner_id) if doorkeeper_token
    end
  end
end
