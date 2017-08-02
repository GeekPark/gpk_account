class Preference < ActiveRecord::Base
  belongs_to :user, touch: true
  serialize :email, CustomHashSerializer
  store_accessor :email, :subscriptions

  validate :ensure_user_has_email, if: :email_changed?

  before_create :set_email_preference

  private

  def set_email_preference
    self.email = {
      enabled: (user.email.present? && !user.is_old?),
      subscriptions: {
        event: 'subscribed',
        report: 'subscribed'
      }
    }
  end

  def ensure_user_has_email
    errors.add(:email, :set_email_first) if user.is_old? || user.email.blank?
  end
end
