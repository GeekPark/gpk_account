class Notification < ActiveRecord::Base
  belongs_to :user
  validates :user_id, presence: true
  validates :content_type, inclusion: { in: %w(event dm comment) }
  validates :content, presence: true

  enum content_type: { event: 1, dm: 2, comment: 3 }
  counter_culture :user, column_name: proc { |model| model.unread? ? 'unread_notifications_count' : nil }

  def read!
    update_attribute(:unread, false)
  end
end
