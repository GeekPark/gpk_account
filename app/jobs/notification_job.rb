class NotificationJob
  include SuckerPunch::Job

  def perform(notification_id, device_id)
    message = Houston::Notification.new(device: device_id)
    ActiveRecord::Base.connection_pool.with_connection do
      notification = Notification.find(notification_id)
      message.alert = notification.content
      message.badge = notification.unread_notifications_count
      message.sound = 'sosumi.aiff'
      message.content_available = false
      message.custom_data = { data: notification.as_json, type: 'notification' }
    end
    APN.push(message)
    logger "Error: #{message.error}." if message.error
  end
end
