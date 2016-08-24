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

  private

  def broadcast_params
    params.permit(:title, :content_type, :content, :send_at, :redirect_id)
  end
end
