class Admin::BroadcastsController < Admin::BaseController
  def index
    @broadcasts = Broadcast.public_send(check_type(params[:type]))
                           .order(created_at: :desc).page(params[:page] || 1).per(params[:per] || 10)
    @data = { broadcasts: @broadcasts, broadcasts_count: Broadcast.all.count }

    respond_to do |format|
      format.html
      format.js { render json: @broadcasts }
    end
  end

  def new
  end

  def create
    @broadcast = Broadcast.new(broadcast_params.merge(user_id: current_user.id))
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

  def check_type(type)
    Broadcast.content_types.keys.include?(type) ? type : :all
  end
end
