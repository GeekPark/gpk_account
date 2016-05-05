class UsersController < ApplicationController
  include Verifiable
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
    render json: current_user, serializer: UserSerializer
  end

  def create
    verify_code? login_name
    user = User.create!(user_create_params)
    warden.set_user(user)
    render json: { user: UserSerializer.new(current_user), callback_url: callback_url }
  end

  def reset_password
    user = User.find_by_email_or_mobile(login_name)
    (render json: { errors: ['User not found'] }, status: 404) && return unless user
    verify_code? login_name
    user.update!(password: params[:user][:password])
    warden.set_user(user)
    render json: { user: user, callback_url: callback_url }
  end

  def check_exist
    render json: { exist: User.find_by_email_or_mobile(login_name).present? }
  end

  private

  def user_create_params
    params.require(:user).permit(:email, :mobile, :password)
  end

  def user_update_params
    params.require(:user).permit(:nickname, :city, :company, :title, :avatar, :bio, :realname, :gender, :birthday)
  end

  def verify_rucaptcha!
    @user = User.find_by_email_or_mobile(params[way]) || User.new(way => params[way])
    unless verify_rucaptcha?(@user) && @user.valid?
      render json: { errors: @user.errors.full_messages }, status: 422
      return
    end
  end

  def get_city_list(id)
    return [ChinaCity.list, nil, nil] if id.nil?
    [
      ChinaCity.list,
      ChinaCity.list("#{id / 1000}000"),
      ChinaCity.list("#{id / 100}00")
    ]
  end
end
