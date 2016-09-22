class BroadcastJob
  include SuckerPunch::Job

  def perform(broadcast_id)
    @connection = generate_connection
    ActiveRecord::Base.connection_pool.with_connection do
      @broadcast = Broadcast.find(broadcast_id)
      @devices = Device.all.to_a
    end
    pushing
  ensure
    @connection&.close
  end

  private

  def pushing
    push_broadcast @devices.shift while @devices.present?
  rescue Errno::EPIPE
    pushing
  end

  def push_broadcast(device)
    message = setup_message device, @broadcast
    @connection.write message.message
    logger "Error: #{message.error}." if message.error
  end

  def generate_connection
    certificate = File.read(File.join(Rails.root, ENV['CERITFICATE']))
    passphrase = ENV['CERITFICATE_PASSWORD']
    connection = Houston::Connection.new(APNGETEWAY, certificate, passphrase)
    connection.open
    connection
  end

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
