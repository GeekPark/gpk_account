module Verifiable
  extend ActiveSupport::Concern

  def verify_mobile
    if @user.mobile.present? && ShortMessage.send_verify_code(@user.mobile, generate_verify_code(@user.mobile))
      render json: { success: 'Sended' }
    else
      render json: { errors: ['Send failed'] }, status: 422
    end
  end

  def verify_email
    if @user.email.present?
      UserMailer.send_verify_code(@user.email, generate_verify_code(@user.email)).deliver_later
      render json: { success: 'Sended' }
    else
      render json: { errors: ['Send failed'] }, status: 422
    end
  end
end
