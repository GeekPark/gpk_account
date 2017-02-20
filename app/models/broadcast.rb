class Broadcast < ActiveRecord::Base
  include Pushable
  notification_type 'broadcast'

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
      set_notification_info(content, as_json, 'all').jpush_at(send_at)
    else
      set_notification_info(content, as_json, 'all').jpush
    end
  end

  def send_message(device)
    BroadcastsDevicesRelation.create(device_id: device.id, broadcast_id: id)
    notification = to_notification(device)
    APN.push(notification)
  end

  def push_notification
    set_notification_info(content, as_json, 'all').jpush
  end
end
