class User::ResetPassword < ActiveType::Object
  attribute :login_name, :string
  attribute :verify_code, :string
  attribute :password, :string

  validates :login_name, :verify_code, :password, presence: true
  validates :password, length: { in: 6..32 }

  validate :user_exist, :verify_code_correct

  after_save :update_password

  def user_exist
    errors.add(:base, 'User not found') unless user
  end

  def verify_code_correct
    key = "verify_code:#{login_name}"
    verify_code_eq = verify_code == Rails.cache.read(key)
    errors.add(:base, I18n.t('errors.invalid_verify_code')) unless verify_code_eq
  end

  def update_password
    user.update(password: password)
  end

  def user
    User.find_by_email_or_mobile(login_name)
  end
end
