class BroadcastJob
  include SuckerPunch::Job

  def perform(broadcast_id)
    return unless HOUSTON_AVAILABLE

    ActiveRecord::Base.connection_pool.with_connection do
      @broadcast = Broadcast.find(broadcast_id)
      devices = Device.all.to_a
      send_to(devices)
    end
  end

  private

  def send_to(devices)
    @broadcast.send_message(devices.shift, connection) while devices.present?
  rescue Errno::EPIPE, OpenSSL::SSL::SSLError
    reset_connection
    sleep 3
    retry
  ensure
    disconnect
  end

  def connection
    return @connection if @connection && @connection.open?
    @connection = Houston::Connection.new(::APNGETEWAY, ::CERTIFICATE, ::PASSPHRASE)
    @connection.open
    @connection
  end

  def reset_connection
    @connection = nil
  end

  def disconnect
    @connection&.close
  end
end
