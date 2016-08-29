class BroadcastJob
  include SuckerPunch::Job

  def perform(broadcast_id)
    return unless Rails.env.production?
    ActiveRecord::Base.connection_pool.with_connection do
      broadcast = Broadcast.find(broadcast_id)
      Device.all.each do |device|
        next unless ['zhukun@geekpark.net'].include?(device.user&.email)
        message = setup_message device, broadcast
        APN.push(message)
        logger "Error: #{message.error}." if message.error
      end
    end
  end

  private

  def setup_message(device, broadcast)
    BroadcastsDevicesRelation.create(device_id: device.id, broadcast_id: broadcast.id)
    message = Houston::Notification.new(device: device.id)
    message.alert = broadcast.content
    message.badge = device.unread_message_count
    message.sound = 'sosumi.aiff'
    message.content_available = false
    message.custom_data = { data: broadcast.as_json, type: 'broadcast' }
    message
  end
end
