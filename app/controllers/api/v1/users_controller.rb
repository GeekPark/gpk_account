class Api::V1::UsersController < Api::BaseController
  before_action -> { doorkeeper_authorize! :write }, except: :create

  def show
    render json: current_user
  end

  def update
    @user = current_user
    @user.update!(user_params)
    render json: @user
  end

  private

  def user_params
    params.permit(:nickname, :city, :company, :title, :bio)
  end
end
