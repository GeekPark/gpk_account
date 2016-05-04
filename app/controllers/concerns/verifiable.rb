module Verifiable
  extend ActiveSupport::Concern

  class VerifyCodeInvalid < StandardError; end

  def send_verify_code
    addr = new_addr || current_addr
    if addr
      method("send_to_#{way}").call(addr)
      render json: { success: 'Sended' }
    else
      render json: { errors: ['Send failed'] }, status: 422
    end
  end

  def verify_code?(key)
    code = Rails.cache.fetch "verify_code:#{key}"
    raise Verifiable::VerifyCodeInvalid unless code.present? && code == params[:verify_code]
  end

  private

  def send_to_email(email)
    UserMailer.send_verify_code(email, generate_verify_code(email)).deliver_later
  end

  def send_to_mobile(mobile)
    ShortMessage.send_verify_code(mobile, generate_verify_code(mobile))
  end

  def generate_verify_code(key)
    Rails.cache.fetch "verify_code:#{key}", expires_in: 30.minutes do
      rand(100_000..999_999).to_s
    end
  end

  def way
    return params[:type] if %w(email mobile).include?(params[:type])
  end

  def current_addr
    current_user&.read_attribute(way)
  end

  def new_addr
    params[way.to_sym]
  end
end
