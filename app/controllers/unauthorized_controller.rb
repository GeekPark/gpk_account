class UnauthorizedController < ActionController::Metal
  include ActionController::UrlFor
  include ActionController::Redirecting
  include Rails.application.routes.url_helpers
  include Rails.application.routes.mounted_helpers

  delegate :flash, to: :request

  def self.call(env)
    @respond ||= action(:respond)
    @respond.call(env)
  end

  def respond
    if session[:user_need_verify].present?
      redirect_to two_factor_verify_url
    else
      flash[:unauthorized_user] = env['warden'].message
      redirect_to login_url
    end
  end
end
