class UsersController < ApplicationController
  before_action :require_login, only: [:show, :update]

  def new
  end

  def welcome
  end

  def show
    @user = current_user
    respond_to do |format|
      format.html
      format.json { render json: @user }
    end
  end

  def update
  end

  def create
    if verify_code?
      user = User.create!(user_create_params)
      warden.set_user(user)
      render json: user
    else
      render json: { errors: ['Verify code invalid'] }, status: :not_acceptable
    end
  end

  def send_verify_code
    user = current_user || User.new(user_create_params)
    if verify_rucaptcha?(user) && user.valid?
      send_register_code
    else
      render json: { errors: user.errors.full_messages }, status: :not_acceptable
    end
  end

  def check_exist
    render json: { exist: User.find_by_email_or_mobile(login_name).present? }
  end

  private

  def user_create_params
    params.require(:user).permit(:email, :mobile, :password)
  end

  def send_register_code
    code = Rails.cache.fetch "verify_code:#{login_name}", expires_in: 30.minutes do
      rand(100_000..999_999).to_s
    end
    logger.debug code
    # Mocked
    render json: { success: 'Sended' }
  end

  def verify_code?
    code = Rails.cache.fetch "verify_code:#{login_name}"
    code.present? && code == params[:verify_code]
  end

  def login_name
    params[:user][:email] || params[:user][:mobile]
  end
end
