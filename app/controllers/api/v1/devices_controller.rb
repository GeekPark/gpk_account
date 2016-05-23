class Api::V1::DevicesController < Api::BaseController
  before_action -> { doorkeeper_authorize! :write }

  def create
    device = Device.find_or_create_by!(device_id: params[:device_id])
    device.update_attributes(user: current_user, last_actived_time: Time.current)
    render json: { message: 'success' }
  end
end
