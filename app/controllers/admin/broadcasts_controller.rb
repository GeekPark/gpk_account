class Admin::BroadcastsController < Admin::BaseController
  def index
    @broadcasts = Broadcast.of_type(params[:type])
                           .order(created_at: :desc)
                           .page(params[:page] || 1)
                           .per(params[:per] || 10)
    @data = {
      broadcasts: @broadcasts,
      broadcasts_count: Broadcast.count
    }

    respond_to do |format|
      format.html
      format.js { render json: @broadcasts }
    end
  end

  def new
  end

  def create
    broadcast_params[:user_id] = current_user.id
    @broadcast = Broadcast.new(broadcast_params)

    if @broadcast.save
      render json: { redirect: admin_broadcasts_path }
    else
      render json: { errors: @broadcast.errors.full_messages }, status: 422
    end
  end

  private

  def broadcast_params
    params.permit(:content_type, :content, :send_at, :redirect)
  end
end
