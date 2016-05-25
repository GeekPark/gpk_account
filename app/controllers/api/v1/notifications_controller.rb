class Api::V1::NotificationsController < Api::BaseController
  before_action -> { doorkeeper_authorize! :admin }, only: :create
  before_action -> { doorkeeper_authorize! :write }, only: [:read, :read_all]

  def create
    current_user.notifications.create(notification_params)
    render json: { count: current_user.unread_notifications_count }
  end

  def read
    current_user.notifications.find(params[:id]).read!
    render json: :noting
  end

  def read_all
    current_user.notifications.each(&:read!)
    render json: :noting
  end

  def notification_params
    params.require(:notification).permit(:content_type, :content, :parent_id)
  end
end
