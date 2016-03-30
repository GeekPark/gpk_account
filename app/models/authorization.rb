class Authorization < ActiveRecord::Base
  belongs_to :user
  validates :provider, presence: true, uniqueness: { scope: :user_id }
  validates :uid, presence: true, uniqueness: { scope: :provider }

  before_destroy :confirm_presence_of_alternate_login

  private

  def confirm_presence_of_alternate_login
    unless user.authorizations.count > 1 || user.mobile.present? || user.email.present?
      errors[:base] << 'can not delete this or you will lose your account permanently'
      return false
    end
  end
end
