class Users::SignupController < ApplicationController
  def new
  end

  def create
    build_signup
    save_signup
  end

  private

  def build_signup
    @signup = User::Signup.new
    @signup.attributes = signup_params
  end

  def save_signup
    if @signup.save
      warden.set_user(@signup)
      render json: { user: UserSerializer.new(current_user), callback_url: callback_url }
    else
      render json: { errors: @signup.errors.full_messages }, status: 422
    end
  end

  def signup_params
    params.require(:user).permit(
      :email,
      :mobile,
      :password,
      :verify_code
    )
  end
end
