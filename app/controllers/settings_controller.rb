class SettingsController < ApplicationController
  include Verifiable
  before_action :require_login

  def verify_current_user
    verify_code? current_addr
    cookies[:identify_token] = {
      value: current_user.generate_identify_token,
      expires: 1.hour.from_now
    }
    render nothing: true
  end

  def update_primary
    verify_code? params[way]
    if current_user.identified?(cookies[:identify_token])
      current_user.update! params.permit(way)
      render json: current_user, serializer: UserSerializer
    else
      render json: { errors: [t('errors.user_not_identified')] }, status: 422
    end
  end

  def update_password
    if current_user.authenticate(params[:password]) || current_user.password.blank?
      current_user.update!(password: params[:new_password])
      render json: current_user, serializer: UserSerializer
    else
      render json: { errors: [t('errors.password_invalid')] }, status: 401
    end
  end

  def unbind_auth
    auth = current_user.authorizations.find_by_provider(params[:provider])
    (render json: { errors: [t('errors.authorization_not_found')] }, status: :not_found) && return unless auth
    if auth.destroy
      render json: current_user, serializer: UserSerializer
    else
      render json: { errors: auth.errors.full_messages }, status: 422
    end
  end

  def identified
    render json: { identified: current_user.identified?(cookies[:identify_token]) }
  end
end
