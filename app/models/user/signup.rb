class User::Signup < ActiveType::Record[User]
  attribute :verify_code, :string

  validates :mobile, presence: { message: 'email and mobile at least have one' },
                     on: :create, if: ->(user) { user.email.blank? }
  validates :password, presence: true
  validates :verify_code, presence: true
  validate :verify_code_correct

  def verify_code_correct
    key = "verify_code:#{email ? email : mobile}"
    verify_code_eq = verify_code == Rails.cache.read(key)
    errors.add(:base, I18n.t('errors.invalid_verify_code')) unless verify_code_eq
  end
end
