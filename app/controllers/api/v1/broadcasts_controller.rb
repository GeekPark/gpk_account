class Api::V1::BroadcastsController < Api::BaseController
  before_action -> { verify_signature! }, only: :create

  def create
    broadcast = Broadcast.new(broadcast_params)
    if broadcast.save
      render json: { message: 'success' }
    else
      render json: { errors: broadcast.errors.full_messages }, status: 422
    end
  end

  def index
    broadcasts = Broadcast
                 .activity_type
                 .sent
                 .order(send_at: :desc, created_at: :desc)
    paginate json: broadcasts, per_page: 20
  end

  def read_all
    relations = BroadcastsDevicesRelation.activity_type.where(device_id: params[:device_id])
    relations.map { |relation| relation.update(read: true) }
  end

  private

  def broadcast_params
    params.permit(:content_type, :content, :send_at, :redirect)
  end

  def with_device_token?
    !params[:device_id].blank?
  end
end
