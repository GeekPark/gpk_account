class UsersController < ApplicationController
  def new
  end

  def show
  end

  def update
  end

  def create
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
    # Mocked
    render json: { success: 'sended' }
  end

  def login_name
    params[:user][:email] || params[:user][:mobile]
  end
end
