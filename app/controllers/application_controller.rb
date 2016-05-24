class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  rescue_from ActiveRecord::RecordInvalid, with: :invalid_error
  rescue_from VerifyCodeInvalid, with: :invalid_verify_code
  rescue_from Unauthorized do
    respond_to do |format|
      format.html { redirect_to login_url, alert: t('errors.need_login') }
      format.json { render json: { errors: [t('errors.need_login')] }, status: :unauthorized }
    end
  end

  helper_method :current_user

  protected

  def require_login
    raise Unauthorized unless current_user
  end

  def callback_url(custom_url = nil)
    session[:callback_url] || custom_url || root_url
  end

  def authorizations_url
    '/#/third'
  end

  def current_user
    warden.user || user_from_cookie
  end

  def unverified_user_from_session
    User.find(session[:user_need_verify]['id']) if session[:user_need_verify].present?
  end

  def user_from_cookie
    warden.authenticate(:cookie) if cookies[:remember_user]
  end

  def login_name
    params[:user][:email] || params[:user][:mobile]
  end

  def warden
    request.env['warden']
  end

  def invalid_error(invalid)
    render json: { errors: invalid.record.errors.full_messages }, status: 422
  end

  def invalid_verify_code
    render json: { errors: [t('errors.invalid_verify_code')] }, status: 422
  end
end
