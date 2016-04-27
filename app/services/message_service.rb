class MessageService
  def initialize(receiver)
    @receiver = receiver
  end

  def send(type)
    case @receiver
    when /\A[^@]+@([^@\.]+\.)+[^@\.]+\z/
      UserMailer.public_send(type, @receiver, generate_verify_code).deliver_later
    when /\A\d{11}\z/
      ShortMessage.public_send(type, @receiver, generate_verify_code)
    else
      false
    end
  end

  private

  def generate_verify_code
    Rails.cache.fetch "verify_code:#{@receiver}", expires_in: 30.minutes do
      rand(100_000..999_999).to_s
    end
  end
end
