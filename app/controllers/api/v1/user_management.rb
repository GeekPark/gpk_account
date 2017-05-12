class Api::V1::UsersController
  module UserManagement
    extend ActiveSupport::Concern

    included do
      before_action -> { doorkeeper_authorize! :admin },
                    only: [:management_show,
                           :management_index,
                           :management_update]

      before_action :find_user,
                    only: [:management_show,
                           :show_user_brief,
                           :management_update,
                           :management_show_state]

      before_action :verify_csrs!, only: :management_show_state
    end

    def management_show
      render json: @user, serializer: UserAdminSerializer
    end

    def show_user_brief
      render json: @user, serializer: UserBriefSerializer
    end

    def management_index
      users = User.all

      users = users.filter_role(param[:role])  if params[:filter_mode]
      users = users.exclude_role(param[:role]) if params[:exclude_mode]

      paginate json: users,
               per_page: 20,
               each_serializer: UserAdminBriefSerializer
    end

    def management_update
      @user.update!(admin_user_params)
      render json: @user
    end

    def management_show_state
      render json: { roles: @user.roles }
    end

    private

    def find_user
      @user = User.find(params[:id] || params[:user_id])
    end

    def admin_user_params
      params.permit(
        :avatar,
        :realname,
        :nickname,
        :city,
        :company,
        :title,
        :bio,
        roles: []
      )
    end
  end
end
