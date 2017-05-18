class Admin::UsersController < Admin::BaseController
  skip_before_action :verify_authenticity_token
  skip_before_action :require_admin, only: :show_state

  before_action :find_user,
                only: [:show,
                       :show_user_brief,
                       :update,
                       :show_state,
                       :ban,
                       :unban]

  def show
    render json: @user, serializer: UserAdminSerializer
  end

  def index
    users = User.smart_filter(params.permit(:email, :nickname, :mobile))

    users = users.filter_role(params[:role])  if params[:mode] == 'filter'
    users = users.exclude_role(params[:role]) if params[:mode] == 'exclude'

    success(each_serializer: UserAdminBriefSerializer) do
      paginated_with_meta users, 20
    end
  end

  def update
    @user.update!(user_params)
    render json: @user
  end

  def show_state
    render json: { roles: @user.roles }
  end

  def ban
    if @user.banned
      render json: { error: 'this user is already banned' }
      return
    end
    @user.update!(is_ban: true)
    render json: { message: 'success' }
  end

  def unban
    unless @user.banned
      render json: { error: 'this user is already unbanned' }
      return
    end
    @user.update!(is_ban: false)
    render json: { message: 'success' }
  end

  private

  def user_params
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

  def find_user
    user_id = params[:id] || params[:user_id]
    if user_id == 'from_access_key'
      @user = User.from_access_key(params[:access_key])
      return
    end

    @user = User.find(user_id)
  end

  # override default admin/base
  def require_admin
    return if current_user && current_user.admin?
    render json: { error: 'access denied' }, status: 401
  end
end
