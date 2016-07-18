class VerifyCodesController < ApplicationController
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
end
