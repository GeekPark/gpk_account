module VerificationCode
  extend ActiveSupport::Concern

  def send_verify_code
    user = User.find_by_email_or_mobile(login_name) || User.new(params.require(:user).permit(:email, :mobile))
    if verify_rucaptcha?(user)
      send_code(login_name)
    else
      render json: { errors: user.errors.full_messages }, status: :not_acceptable
    end
  end

  def verify_code?(key = login_name)
    code = Rails.cache.fetch "verify_code:#{key}"
    code.present? && code == params[:verify_code]
  end

  private

  def send_code(receiver)
    message_service = MessageService.new(receiver)
    sended = message_service.send(:send_verify_code)
    if sended
      render json: { success: 'Sended' }
    else
      render json: { errors: ['Send failed'] }, status: :not_acceptable
    end
  end

  def login_name
    params[:user][:email] || params[:user][:mobile]
  end
end
