class Device < ActiveRecord::Base
  belongs_to :user
  has_many :broadcasts_devices_relations
  has_many :broadcasts, through: :broadcasts_devices_relations

  validates :device_id, presence: true, uniqueness: true

  def self.most_recent
    all.order(last_actived_time: :desc).first
  end

  def unread_message_count
    broadcast_count = BroadcastsDevicesRelation.activity_type.where(device_id: id, read: false).count
    notification_count = user&.unread_notifications_count || 0
    broadcast_count + notification_count
  end
end
