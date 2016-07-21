class Setting::Identify < ActiveType::Object
  attribute :verify_code, :string
  attribute :type, :string
  attribute :user_id, :string

  validates :verify_code, :type, :user_id, presence: true
  validate :user_exist
  validate :verify_code_correct

  after_save :update_old_user

  def user_exist
    errors.add(:base, 'User not found') unless user
  end

  def verify_code_correct
    return unless user
    key = "verify_code:#{login_name}"
    verify_code_eq = verify_code == Rails.cache.read(key)
    errors.add(:base, I18n.t('errors.invalid_verify_code')) unless verify_code_eq
  end

  def login_name
    user.public_send(type)
  end

  def user
    User.find_by_id(user_id)
  end

  def update_old_user
    user.update_attribute(:is_old, false) if type == 'email' && user.is_old?
  end
end
