class VerifyCode < ActiveType::Object
  attribute :type, :string
  attribute :email, :string
  attribute :mobile, :string

  validates :type, inclusion: { in: %w(email mobile) }
  validates :email, presence: true,
    if: ->(verify_code) { verify_code.type == 'email' }
  validates :mobile, presence: true,
    if: ->(verify_code) { verify_code.type == 'mobile' }

  after_save :perform_send

  def perform_send
    case type
    when 'email'
      send_to_email
    when 'mobile'
      send_to_mobile
    end
  end

  def send_to_email
    UserMailer.send_verify_code(email, generate_verify_code(email)).deliver_later
  end

  def send_to_mobile
    ShortMessage.send_verify_code(mobile, generate_verify_code(mobile))
  end

  def generate_verify_code(key)
    Rails.cache.fetch "verify_code:#{key}", expires_in: 30.minutes do
      rand(100_000..999_999).to_s
    end
  end
end
