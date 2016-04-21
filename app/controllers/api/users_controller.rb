class Api::UsersController < Api::BaseController
  before_action -> { doorkeeper_authorize! :public }, only: :show
  before_action -> { doorkeeper_authorize! :write }, only: :update

  def show
    render json: current_resource_owner
  end

  def update
    @user = current_resource_owner
    @user.update!(user_params)
    render json: @user
  end

  private

  def user_params
    params.permit(:nickname, :city, :company, :title, :bio)
  end

  def default_serializer_options
    {
      root: false
    }
  end
end
