class Admin::BroadcastsController < Admin::BaseController
  def index
    params[:type] = 'all' unless %w(topic_type activity_type).include?(params[:type])
    @broadcasts = Broadcast.public_send(params[:type] || :all)
                           .order(created_at: :desc).page(params[:page] || 1).per(params[:per] || 10)
    @data = { broadcasts: @broadcasts }
  end

  def new
  end

  def create
    @broadcast = Broadcast.new(broadcast_params.merge(user_id: current_user.id))
    if @broadcast.save
      redirect_to admin_broadcasts_path
    else
      render json: { errors: @broadcast.errors.full_messages }, status: 422
    end
  end

  private

  def broadcast_params
    params.permit(:content_type, :content, :send_at, :redirect_id)
  end
end
