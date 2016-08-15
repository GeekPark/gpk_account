class Settings::EditEmailOrMobileController < ApplicationController
  before_action :require_login, :require_identify

  def update
    find_edit_email_or_mobile
    update_edit_email_or_mobile
  end

  private

  def find_edit_email_or_mobile
    @eeom = Setting::EditEmailOrMobile.find(current_user.id)
  end

  def update_edit_email_or_mobile
    if @eeom.update(edit_email_or_mobile_params)
      render json: @eeom, serializer: UserSerializer
    else
      render json: { errors: @eeom.errors.full_messages }, status: 422
    end
  end

  def edit_email_or_mobile_params
    params.permit(:type, :email, :mobile, :verify_code)
  end
end
