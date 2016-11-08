class Api::V1::DevicesController < Api::BaseController
  def create
    device = Device.find_or_create_by!(device_id: params[:device_id])
    device.update_attributes(user: current_user || nil,
                             last_actived_time: Time.current)
    render json: { message: 'success' }
  end
end
