class Api::V1::RegisterController < Api::BaseController
  include Verifiable
  before_action :verify_signature!, only: [:register, :reset_password]
  before_action :find_user, only: [:send_verify_code]
  before_action :verify_user_not_exist!, only: [:send_verify_code], if: -> { params[:reset_password].nil? }
  before_action :verify_user_exist!, only: [:send_verify_code], if: -> { params[:reset_password] }
  # before_action :verify_rucaptcha!, only: :send_verify_code

  def captcha
    hex = SecureRandom.hex
    captcha = RuCaptcha::Captcha.random_chars
    Rails.cache.write "captcha_key:#{hex}", captcha, expired_in: 2.minutes
    response.headers['captcha_key'] = hex
    send_data RuCaptcha::Captcha.create(captcha)
  end

  def register
    key = params[:user][:mobile] || params[:user][:email]
    verify_code?(key)
    user = User.create! register_param
    delete_cache_code(key)
    token = Doorkeeper::AccessToken.find_or_create_for(@client, user.id, @client.scopes, 7200, true)
    render json: token
  end

  def check_verify_code
    verify_code?(params[:mobile] || params[:email])
    render json: { message: 'success' }
  end

  def reset_password
    reset_password = User::ResetPassword.new(reset_password_params)
    if reset_password.save
      token = Doorkeeper::AccessToken.find_or_create_for(@client, reset_password.user.id, @client.scopes, 7200, true)
      render json: token
    else
      render json: { error: 'reset fail', message: reset_password.errors.full_messages }, status: 422
    end
  end

  def verify_rucaptcha
    if params[:captcha_key].present?
      (captcha = Rails.cache.read "captcha_key:#{params[:captcha_key]}") &&
        Rails.cache.delete("captcha_key:#{params[:captcha_key]}")
    end

    right = params[:captcha].present? && captcha == params[:captcha]

    (render json: {} , status: 422) && return unless right
    render json: {}, status: 200
  end

  private

  def reset_password_params
    login_name = params[:user][:email] || params[:user][:mobile]
    params.require(:user).permit(:password, :verify_code).merge(login_name: login_name)
  end

  def register_param
    params.require(:user).permit(:email, :mobile, :password)
  end

  def find_user
    @user = User.find_by_email(params[:email] || '') || User.find_by_mobile(params[:mobile] || '')
  end

  def verify_user_not_exist!
    (render json: { error: 'send fail', message: t('errors.account_already_exist') }, status: 422) && return if @user
  end

  def verify_user_exist!
    (render json: { error: 'send fail', message: t('errors.account_not_exist') }, status: 422) && return if @user.nil?
  end
end
