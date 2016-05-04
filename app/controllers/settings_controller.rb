class SettingsController < ApplicationController
  include Verifiable
  before_action :require_login
  before_action :fetch_user, only: [:verify_email, :verify_mobile]
  before_action :current_user_authenticate?, only: :update_primary
  before_action :authenticate_password, only: :update_password

  def verify_current_user
    verify_code(current_user.read_attribute(primary)) { return }
    render nothing: true
  end

  def update_primary
    verify_code(params[primary]) { return }
    current_user.update!(primary => params[primary])
    render json: current_user, serializer: UserSerializer
  end

  def update_password
    current_user.update!(password: params[:new_password])
    render json: current_user, serializer: UserSerializer
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

  def fetch_user
    @user = current_user
    @user.email = params[:email] if params[:email]
    @user.mobile = params[:mobile] if params[:mobile]
  end

  def primary
    params[:primary] == 'email' ? 'email' : 'mobile'
  end

  def set_current_user_authenticate
    token = SecureRandom.urlsafe_base64
    cookies['authenticate_token'] = {
      value: token,
      expires: 1.hour.from_now
    }
    Rails.cache.write("authenticate_token:#{current_user.id}", token, expires_in: 1.hour)
  end

  def current_user_authenticate?
    token = Rails.cache.fetch("authenticate_token:#{current_user.id}")
    unless token.present? && token == cookies['authenticate_token']
      render json: { errors: ['User not authenticate'] }, status: 422
      return
    end
  end

  def verify_code(key)
    (render json: { errors: ['Verify code invalid'] }, status: 422) && yield unless verify_code?(key)
  end
end
