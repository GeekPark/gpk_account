class UsersController < ApplicationController
  before_action :require_login, only: [:show, :update]
  before_action :verify_rucaptcha!, only: :send_verify_code
  def new
  end

  def show
    user = UserSerializer.new(current_user)
    @data = { user: user, city: get_city_list(user.city) }.to_json
    respond_to do |format|
      format.html
      format.json { render json: @data }
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
      render json: { user: UserSerializer.new(current_user), callback_url: callback_url }
    else
      render json: { errors: ['Verify code invalid'] }, status: :not_acceptable
    end
  end

  def send_verify_code
    message_service = MessageService.new(login_name)
    if message_service.send_verify_code
      render json: { success: 'Sended' }
    else
      render json: { errors: ['Send failed'] }, status: :not_acceptable
    end
  end

  def reset_password
    user = User.find_by_email_or_mobile(login_name)
    (render json: { errors: ['User not found'] }, status: :not_found) && return unless user
    if verify_code?
      user.update!(password: params[:user][:password])
      warden.set_user(user)
      render json: { user: user, callback_url: callback_url }
    else
      render json: { errors: ['Verify code invalid'] }, status: :not_acceptable
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

  def get_city_list(id)
    return ChinaCity.list if id.nil?
    [
      ChinaCity.list,
      ChinaCity.list("#{id / 1000}000"),
      ChinaCity.list("#{id / 100}00")
    ]
  end
end
