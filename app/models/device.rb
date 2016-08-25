class Device < ActiveRecord::Base
  belongs_to :user
  has_many :broadcasts_device_relations
  has_many :broadcasts, through: :broadcasts_devices_relations

  validates :device_id, presence: true, uniqueness: true

  def unread_message_count
    boradcast_count = BroadcastsDevicesRelation.where(device_id: device.id, unread: true).count
    notification_count = device.user&.unread_notifications_count || 0
    boradcast_count + notification_count
  end
end
