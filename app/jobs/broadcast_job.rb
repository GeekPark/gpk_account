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
    @broadcast.send_message(devices.shift) while devices.present?
  end
end
