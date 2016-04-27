module Api
  module V1
    class UsersController < Api::BaseController
      before_action -> { doorkeeper_authorize! :write }

      def show
        render json: current_user
      end

      def update
        @user = current_user
        @user.update!(user_params)
        render json: @user
      end

      def user_params
        params.permit(:nickname, :city, :company, :title, :bio)
      end
    end
  end
end
