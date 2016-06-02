class Preference < ActiveRecord::Base
  belongs_to :user
  serialize :email, CustomHashSerializer
  store_accessor :email, :subscriptions

  before_create :set_email_preference

  private

  def set_email_preference
    self.email = {
      enabled: true,
      subscriptions: {
        event: 'subscribed',
        report: 'subscribed'
      }
    }
  end
end
