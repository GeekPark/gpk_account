class SettingsController < ApplicationController
  include Verifiable
  before_action :require_login
  before_action :authenticate_password, only: :update_password

  def verify_current_user
    verify_code? current_addr
    token = current_user.generate_identify_token
    cookies[:identify_token] = {
      value: token,
      expires: 1.hour.from_now
    }
    # Unset is_old when old user verify their email
    current_user.update!(is_old: false) if current_user.is_old
    render nothing: true
  end

  def update_primary
    verify_code? params[way]
    if updatable?
      current_user.update!(updatable_params)
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

  def identified
    render json: { identified: current_user.identified?(cookies[:identify_token]) }
  end

  private

  def authenticate_password
    render json: { errors: ['Password invalid'] }, status: 403 unless current_user.authenticate(params[:password])
  end

  def updatable_params
    if current_user.sns_user?
      params.permit(way, :password)
    elsif current_user.is_old && way == 'email'
      params.permit(way).merge(is_old: false)
    else
      params.permit(way)
    end
  end

  def updatable?
    current_user.identified?(cookies[:identify_token]) ||
      (current_user.is_old && way == 'email') || # Allow old user set a new email once
      current_user.sns_user? # Allow sns user set email mobile and password
  end
end
