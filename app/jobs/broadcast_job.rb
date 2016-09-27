class BroadcastJob
  include SuckerPunch::Job

  def perform(broadcast_id)
    ActiveRecord::Base.connection_pool.with_connection do
      @broadcast = Broadcast.find(broadcast_id)
      @broadcast.send_to_devices { connection }
    end
  ensure
    connection.close
  end

  private

  def connection
    return @connection if @connection && @connection.open?
    @connection = Houston::Connection.new(::APNGETEWAY, ::CERTIFICATE, ::PASSPHRASE)
    @connection.open
    @connection
  end
end
