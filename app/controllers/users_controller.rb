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
    current_user.update!(user_update_params)
    render json: current_user
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
      send_code(login_name)
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

  def user_update_params
    params.require(:user).permit(:nickname, :city, :company, :title, :avatar, :bio)
  end

  def send_code(receiver)
    message_service = MessageService.new(receiver)
    sended = message_service.send(:send_verify_code)
    if sended
      render json: { success: 'Sended' }
    else
      render json: { errors: ['Send failed'] }, status: :not_acceptable
    end
  end

  def verify_code?
    code = Rails.cache.fetch "verify_code:#{login_name}"
    code.present? && code == params[:verify_code]
  end

  def login_name
    params[:user][:email] || params[:user][:mobile]
  end
end
