class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  rescue_from ActiveRecord::RecordInvalid, with: :invalid_error

  helper_method :current_user

  protected

  def require_login
    unless current_user
      respond_to do |format|
        format.html { redirect_to login_url, alert: 'Need Login' }
        format.json { render json: { errors: ['Need login'] }, status: :unauthorized }
      end
    end
  end

  def callback_url(custom_url = nil)
    session[:callback_url] || custom_url || root_url
  end

  def current_user
    warden.user || user_from_cookie
  end

  def user_from_cookie
    warden.authenticate(:cookie) if cookies['remember_token']
  end

  def verify_rucaptcha!
    verify_rucaptcha? ||
      (render json: { errors: ['Captcha invalid!'] }, status: :not_acceptable) && return
  end

  def verify_code?(key = login_name)
    code = Rails.cache.fetch "verify_code:#{key}"
    code.present? && code == params[:verify_code]
  end

  def login_name
    params[:user][:email] || params[:user][:mobile]
  end

  def warden
    request.env['warden']
  end

  def invalid_error(invalid)
    render status: :not_acceptable, json: { errors: invalid.record.errors.full_messages }
  end
end
