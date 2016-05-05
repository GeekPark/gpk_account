class SettingsController < ApplicationController
  include Verifiable
  before_action :require_login
  before_action :authenticate_password, only: :update_password

  def verify_current_user
    verify_code? current_addr
    token = current_user.generate_identify_token
    cookies['identify_token'] = {
      value: token,
      expires: 1.hour.from_now
    }
    render nothing: true
  end

  def update_primary
    if current_user.identified?(cookies[:identify_token])
      verify_code? params[way]
      current_user.update!(way => params[way])
      render json: current_user, serializer: UserSerializer
    else
      render json: { errors: ['User not identified'] }, status: 422
    end
  end

  def update_password
    if current_user.authenticate(params[:password])
      current_user.update!(password: params[:new_password])
      render json: current_user, serializer: UserSerializer
    else
      render json: { errors: ['Password invalid'] }, status: 403
    end
  end

  def unbind_auth
    auth = current_user.authorizations.find_by_provider(params[:provider])
    if auth
      auth.destroy
      render json: current_user, serializer: UserSerializer
    else
      render json: { errors: ['Authorization not found'] }, status: :not_found
    end
  end

  private

  def authenticate_password
    render json: { errors: ['Password invalid'] }, status: 403 unless current_user.authenticate(params[:password])
  end
end
