class SessionsController < ApplicationController
  before_action :require_login, only: :destroy

  def new
    redirect_to root_url if current_user
    warden.message.present? &&
      @error = { errors: ['invalid username or password'], login_name: warden.message }.to_json
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

  private

  def bind_auth
    auth = current_user.authorizations.build(auth_params)
    if auth.save
      render json: { user: UserSerializer.new(current_user).to_json }
    else
      render json: { errors: auth.errors.full_messages }, status: :not_accepted
    end
  end

  def auth_params
    request.env['omniauth.auth']&.symbolize_keys&.extract!(:provider, :uid)
  end
end
