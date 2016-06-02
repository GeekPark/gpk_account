class SettingsController < ApplicationController
  include Verifiable
  before_action :require_login, except: [:send_verify_code, :verify_current_user]
  before_action :require_identify, only: [:update_primary, :two_factor_qr, :two_factor]
  before_action :require_login_or_unverified_user_from_session, only: [:send_verify_code, :verify_current_user]

  def verify_current_user
    verify_code? current_addr
    current_user || warden.set_user(@user)
    current_user.update_attribute(:is_old, false) if way == 'email'
    cookies[:identify_token] = {
      value: current_user.generate_identify_token,
      expires: 1.hour.from_now
    }
    render json: current_user, serializer: UserSerializer
  end

  def update_primary
    verify_code? params[way]
    current_user.update! params.permit(way)
    render json: current_user, serializer: UserSerializer
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

  def require_identify
    unless current_user.identified?(cookies[:identify_token])
      render json: { errors: [t('errors.user_not_identified')] }, status: 422
      return
    end
  end

  def require_login_or_unverified_user_from_session
    @user = unverified_user_from_session || current_user
    raise Unauthorized unless @user
    @current_addr = @user.read_attribute(way)
  end
end
