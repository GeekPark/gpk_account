class Api::V1::NotificationsController < Api::BaseController
  before_action -> { verify_signature! }, only: :create
  before_action -> { doorkeeper_authorize! :write, :public }, except: :create, if: -> { params[:access_key].blank? }

  def index
    requires! :scope, values: Notification.content_types.keys
    content_type = Notification.content_types[params[:scope]]
    notifications = current_user.notifications
                                .where(content_type: content_type)
    headers['unread_count'] = notifications.where(unread: true).count
    paginate json: notifications, per_page: 10
  end

  def all
    return render json: { error: 'can not find user' }, status: 404 unless current_user
    notifications = current_user.notifications
    paginate json: notifications, per_page: 10
  end

  def create
    requires! :id
    current_user = User.find(params[:id])
    current_user.notifications.create(notification_params)
    render json: { count: current_user.reload.unread_notifications_count }
  end

  def create_notification
    user = User.find_by_id(params["notification"]["user_id"])
    user.notifications.create(notification_params)
    render json: { count: user.reload.unread_notifications_count }
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
    params.require(:notification).permit(
      :title,
      :from_user_id,
      :direct_id,
      :content_type,
      :content,
      :parent_id,
      :user_id,
      :comment
    )
  end
end
