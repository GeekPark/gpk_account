class Broadcast < ActiveRecord::Base
  has_many :broadcasts_devices_relations
  has_many :devices, through: :broadcasts_devices_relations
  has_one :user
  after_create :push_broadcast

  validates :content, presence: true, length: { maximum: 140 }

  enum content_type: [:activity_type, :topic_type]

  scope :of_type, lambda { |type|
    if type && type.intern.in?(Broadcast.content_types)
      public_send(type)
    else
      all
    end
  }

  def push_broadcast
    if send_at
      delay = send_at - Time.now.getlocal
      BroadcastJob.perform_in(delay, id)
    else
      BroadcastJob.perform_in(3, id)
    end
  end

  def send_message(device)
    BroadcastsDevicesRelation.create(device_id: device.id, broadcast_id: id)
    notification = to_notification(device)
    APN.push(notification)
  end

  def to_notification(device)
    Houston::Notification.new(device: device.id).tap do |msg|
      msg.alert = content
      msg.badge = device.unread_message_count
      msg.sound = 'sosumi.aiff'
      msg.content_available = false
      msg.custom_data = { data: as_json, type: 'broadcast' }
    end
  end
end
