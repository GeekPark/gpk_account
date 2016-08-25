class BroadcastJob
  include SuckerPunch::Job

  def perform(broadcast_id)
    return if Rails.env.test?
    ActiveRecord::Base.connection_pool.with_connection do
      broadcast = Broadcast.find(broadcast_id)
      Device.all.each do |device|
        message = setup_message device, broadcast
        APN.push(message)
      end
      logger "Error: #{message.error}." if message.error
    end
  end

  private

  def setup_message(device, broadcast)
    BroadcastsDevicesRelation.create(device_id: device.id, broadcoast_id: broadcast.id)
    message = Houston::Notification.new(device: device.id)
    message.alert = broadcast.title
    message.badge = device.unread_message_count
    message.sound = 'sosumi.aiff'
    message.content_available = false
    message.custom_data = message.as_json
    message
  end
end
