class Settings::IdentifiesController < ApplicationController
  before_action :require_login_or_unverified_user_from_session

  def create
    build_identify
    save_identify
  end

  private

  def build_identify
    @identify = Setting::Identify.new
    @identify.attributes = identify_params
  end

  def save_identify
    if @identify.save
      cookies[:identify_token] = {
        value: @user.generate_identify_token,
        expires: 1.hour.from_now
      }
      warden.set_user(@user) unless current_user
      render json: @user, serializer: UserSerializer
    else
      render json: { errors: @identify.errors.full_messages }, status: 422
    end
  end

  def identify_params
    params.permit(:verify_code, :type).merge(user_id: @user.id)
  end

  def require_login_or_unverified_user_from_session
    @user = unverified_user_from_session || current_user
    raise CantCantCant::PermissionDenied unless @user
  end
end
