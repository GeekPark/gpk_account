class SettingsController < ApplicationController
  before_action :require_identify, only: [:two_factor_qr, :two_factor]

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

  def two_factor_qr
    if current_user.two_factor_enable?
      render json: { errors: [t('errors.already_enabled_two_factor')] }
    else
      render json: { qr_code: current_user.two_factor_qr }
    end
  end

  def two_factor
    current_user.two_factor_switch(params[:otp_code])
    render json: current_user, serializer: UserSerializer
  end

  def update_preference
    current_user.preference.update(build_preference_params)
    render json: current_user, serializer: UserSerializer
  end

  private

  def build_preference_params
    params.require(:user).require(:preference).permit(email: [:enabled, subscriptions: [:event, :report]])
  end
end
