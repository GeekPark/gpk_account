class Broadcast < ActiveRecord::Base
  has_many :broadcasts_devices_relations
  has_many :devices, through: :broadcasts_devices_relations
  has_one :user
  after_create :push_broadcast

  validates :content, presence: true, length: { maximum: 140 }

  enum content_type: [:activity_type, :topic_type]

  def push_broadcast
    if send_at
      delay = send_at - Time.now.getlocal
      BroadcastJob.perform_in(delay, id)
    else
      BroadcastJob.perform_in(3, id)
    end
  end

  def send_to_devices(connection)
    devices = Device.all.to_a

    begin
      send_message(devices.shift, connection) while devices.present?
    rescue Errno::EPIPE
      sleep 3
      retry
    end
  end

  private

  def send_message(device, connection)
    BroadcastsDevicesRelation.create(device_id: device.id, broadcast_id: id)
    notification = to_notificaiton
    logger "Error: #{notificaiton.error}." if notifcation.error
    connection.write notification.message
  end

  def to_notificaiton
    Houston::Notification.new(device: device.id).tap do |msg|
      msg.alert = broadcast.content
      msg.badge = device.unread_message_count
      msg.sound = 'sosumi.aiff'
      msg.content_available = false
      msg.custom_data = { data: broadcast.as_json, type: 'broadcast' }
    end
  end
end
