class Notification < ActiveRecord::Base
  belongs_to :user
  belongs_to :from_user, class_name: 'User'
  validates :user_id, presence: true
  validates :content_type, inclusion: { in: %w(event dm comment timeline_comment) }
  validates :content, presence: true
  delegate :unread_notifications_count, to: :user
  after_create :push_notification

  enum content_type: { event: 1, dm: 2, comment: 3, timeline_comment: 4 }
  counter_culture :user, column_name: proc { |model| model.unread? ? 'unread_notifications_count' : nil }

  default_scope { order(created_at: :desc) }

  def read!
    update_attribute(:unread, false)
  end

  def as_json
    super(only: [:content_type, :content, :parent_id])
  end

  def push_notification
    user.devices.each do |device|
      NotificationJob.perform_async(id, device.device_id)
    end
  end
end
