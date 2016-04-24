class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  rescue_from ActiveRecord::RecordInvalid, with: :invalid_error

  helper_method :current_user

  private

  def current_user
    warden.user
  end

  def warden
    request.env['warden']
  end

  def invalid_error(invalid)
    render status: :not_acceptable, json: { errors: invalid.record.errors.full_messages }
  end
end
