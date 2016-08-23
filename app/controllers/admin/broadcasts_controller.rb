class Admin::BroadcastsController < Admin::BaseController
  def index
    @broadcasts = Broadcast.all
    @data = { broadcasts: @broadcasts }
  end

  def new
    @broadcasts = Broadcast.new
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
    params.require(:broadcast).permit(:title, :content_type, :content, :send_at, :redirect_id)
  end
end
