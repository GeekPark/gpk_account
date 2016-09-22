class BroadcastJob
  include SuckerPunch::Job

  CERTIFICATE = File.read(File.join(Rails.root, ENV['CERITFICATE'])).freeze
  PASSPHRASE = ENV['CERITFICATE_PASSWORD'].freeze

  def perform(broadcast_id)
    ActiveRecord::Base.connection_pool.with_connection do
      @broadcast = Broadcast.find(broadcast_id)
      @broadcast.send_to_devices(connection)
    end
  ensure
    connection.close
  end

  private

  def connection
    return @connection if @connection && @connection.open?
    @connection = Houston::Connection.new(APNGETEWAY, CERTIFICATE, PASSPHRASE)
    @connection.open
    @connection
  end
end
