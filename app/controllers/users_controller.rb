class UsersController < ApplicationController
  include VerificationCode
  before_action :require_login, only: [:show, :update, :welcome]

  def new
  end

  def show
    @user = UserSerializer.new(current_user).to_json
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
      render json: { user: UserSerializer.new(current_user), callback_url: callback_url }
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
end
