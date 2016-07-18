class VerifyCodesController < ApplicationController
  before_action :verify_rucaptcha!

  def create
    build_verify_code
    save_verify_code
  end

  private

  def build_verify_code
    @verify_code = VerifyCode.new
    @verify_code.attributes = verify_code_params
  end

  def save_verify_code
    if @verify_code.save
      render json: { success: 'Sended' }
    else
      render json: { errors: ['Send failed'] }, status: 422
    end
  end

  def verify_code_params
    params.permit(
      :type,
      :email,
      :mobile
    )
  end

  def verify_rucaptcha!
    @user = User.find_by_email_or_mobile(params[way]) || User.new(way => params[way])
    unless verify_rucaptcha?(@user) && @user.valid?
      render json: { errors: @user.errors.full_messages }, status: 422
      return
    end
  end

  def way
    return params[:type] if %w(email mobile).include?(params[:type])
  end
end
