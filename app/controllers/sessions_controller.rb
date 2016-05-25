class SessionsController < ApplicationController
  before_action :require_login, only: :destroy

  def new
    (redirect_to root_url) && return if current_user
    flash[:unauthorized_user].present? &&
      @data = { errors: [t('errors.invalid_username_or_password')], login_name: flash[:unauthorized_user] }
  end

  def create
    if auth_params && current_user
      bind_auth
    else
      warden.authenticate!
      redirect_to callback_url
    end
  end

  def destroy
    warden.logout
    redirect_to login_url
  end

  def two_factor_verify
    user = unverified_user_from_session
    (redirect_to login_url) && return unless user
    @data = { user: UserSerializer.new(user) }
  end

  private

  def bind_auth
    auth = current_user.authorizations.build(auth_params)
    if auth.save
      flash[:success] = t('authorizations.bind',
        provider: t("authorizations.providers.#{auth.provider}"))
    else
      flash[:error] = t('errors.authorization_bind_failed',
        provider: t("authorizations.providers.#{auth.provider}"))
    end
    redirect_to authorizations_url
  end

  def auth_params
    request.env['omniauth.auth']&.to_hash&.symbolize_keys&.extract!(:provider, :uid)
  end
end
