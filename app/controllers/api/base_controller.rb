class Api::BaseController < ActionController::Base
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActionController::ParameterMissing, ActiveRecord::RecordInvalid,
    with: :unprocessable_error

  private

  def current_resource_owner
    User.find(doorkeeper_token.resource_owner_id) if doorkeeper_token
  end

  def not_found
    render status: :not_found, json: { error: 'not found' }
  end

  def unprocessable_error(exception)
    render status: :unprocessable_entity, json: { error: exception.message }
  end
end
