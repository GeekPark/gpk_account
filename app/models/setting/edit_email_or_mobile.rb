class Setting::EditEmailOrMobile < ActiveType::Record[User]
  attribute :type, :string
  attribute :verify_code, :string

  validates :verify_code, presence: true
  validates :type, presence: { in: %w(email mobile) }
  validate :verify_code_correct

  def verify_code_correct
    return false unless type
    key = "verify_code:#{type == 'email' ? email : mobile}"
    verify_code_eq = verify_code == Rails.cache.read(key)
    errors.add(:base, I18n.t('errors.invalid_verify_code')) unless verify_code_eq
  end
end
