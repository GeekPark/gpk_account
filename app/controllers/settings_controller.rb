class SettingsController < ApplicationController
  before_action :require_login
  before_action :authenticate_password, only: :update_password

  def update_password
    if current_user.update(password: params[:new_password])
      render json: UserSerializer.new(current_user).to_json
    else
      render json: { errors: current_user.errors.full_messages }
    end
  end

  def unbind_auth
    auth = current_user.authorizations.find_by_provider(params[:provider])
    if auth
      auth.destroy
      render json: UserSerializer.new(current_user).to_json
    else
      render json: { errors: ['Authorization not found'] }, status: :not_found
    end
  end

  private

  def authenticate_password
    unless current_user.authenticate(params[:password])
      render json: { errors: ['Password invalid'] }, status: :unauthorized
      return
    end
  end
end
