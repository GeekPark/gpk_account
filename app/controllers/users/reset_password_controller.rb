class Users::ResetPasswordController < ApplicationController
  def new
  end

  def create
    build_reset_password
    save_reset_password
  end

  private

  def build_reset_password
    @reset_password = User::ResetPassword.new(reset_password_params)
  end

  def save_reset_password
    if @reset_password.save
      warden.set_user(@reset_password.user)
      render json: { user: @reset_password.user, callback_url: callback_url }
    else
      render json: { errors: @reset_password.errors.full_messages }, status: 422
    end
  end

  def reset_password_params
    params.require(:user).permit(:password, :verify_code).merge(login_name: login_name)
  end
end
