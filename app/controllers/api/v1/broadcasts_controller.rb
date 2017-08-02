class Api::V1::BroadcastsController < Api::BaseController
  # before_action -> { verify_signature! }, only: :create
  include ApiControllerHelper

  def create
    Rails.logger.info("create broadcast")
    Rails.logger.info(broadcast_params.inspect)
    broadcast = Broadcast.new(broadcast_params)
    if broadcast.save
      Rails.logger.info("broadcast create success")
      render json: { message: 'success' }
    else
      Rails.logger.info("broadcast create failed")
      render json: { errors: broadcast.errors.full_messages }, status: 422
    end
  end

  def index
    broadcasts = Broadcast
                 .topic_type
                 .sent
                 .order(created_at: :desc)
    # paginate json: broadcasts, per_page: 20
    render json: paginated_with_meta(broadcasts, 20)
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
