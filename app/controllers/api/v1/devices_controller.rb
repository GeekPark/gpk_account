class Api::V1::DevicesController < Api::BaseController
  before_action -> { doorkeeper_authorize! :write }

  def create
    device = Device.find_or_initialize_by(device_id: params[:device_id], user: current_user)
    device.last_actived_time = Time.now.getlocal
    device.save!
    render json: { message: 'success' }
  end

  def destroy
    device = Device.find_by_device_id(params[:device_id])
    device.destroy unless device.nil?

    render json: { message: 'success' }
  end
end
