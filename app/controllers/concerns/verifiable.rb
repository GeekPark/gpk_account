module Verifiable
  extend ActiveSupport::Concern

  def send_verify_code
    addr = params[way] || current_addr
    if addr
      method("send_to_#{way}").call(addr)
      render json: { success: 'Sended' }
    else
      render json: { errors: ['Send failed'] }, status: 422
    end
  end

  def verify_code?(key)
    in_valid_times(key)
    code = Rails.cache.fetch "verify_code:#{key}"
    raise VerifyCodeInvalid unless code.present? && code == params[:verify_code]
  end

  def delete_cache_code(key)
    Rails.cache.delete "verify_code:#{key}"
  end

  private

  def in_valid_times(key)
    times = Rails.cache.fetch "check_time:#{key}"
    raise CheckVerifyCodeTimeInvalid if times <= 0
    Rails.cache.write "check_time:#{key}", times - 1, expires_in: 30.minutes
  end

  def send_to_email(email)
    UserMailer.send_verify_code(email, generate_verify_code(email)).deliver_later
  end

  def send_to_mobile(mobile)
    ShortMessage.send_verify_code(mobile, generate_verify_code(mobile))
  end

  def generate_verify_code(key)
    Rails.cache.write "check_time:#{key}", 10, expires_in: 30.minutes
    Rails.cache.fetch "verify_code:#{key}", expires_in: 30.minutes do
      rand(100_000..999_999).to_s
    end
  end

  def way
    return params[:type] if %w(email mobile).include?(params[:type])
  end

  def current_addr
    @current_addr ||= current_user&.read_attribute(way)
  end
end
