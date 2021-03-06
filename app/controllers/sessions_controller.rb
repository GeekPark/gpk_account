class SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create, :destroy]

  def new
    return (redirect_to user_url) if current_user
    cookies[:callback_url] = params[:callback_url]
    login_name = session.delete(:unauthorized_user)
    if login_name.present?
      @data = { login_name: login_name }
      flash.now[:error] = t('errors.invalid_username_or_password')
    end
  end

  def create
    if auth_params && current_user
      bind_auth
    elsif request.env['omniauth.redirect'].present?
      uri = request.env['omniauth.redirect']
      return (redirect_to uri) if sanitary_uri?(uri)
      render status: 400, text: 'invalid redirection location'
    else
      warden.authenticate!
      if cookies[:callback_url]
        redirect_url = cookies[:callback_url]
        cookies.delete(:callback_url)
      end
      redirect_to (redirect_url || callback_url)
    end
  end

  def destroy
    if request.get? && current_user == User.find(doorkeeper_token&.resource_owner_id)
      warden.logout
    elsif current_user
      warden.logout
    end
    redirect_to params[:referrer] || root_url
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

  def sanitary_uri?(uri)
    URI.parse(uri).scheme.in?(%w(http https))
  end
end
