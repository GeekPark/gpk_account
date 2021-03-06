class Api::V1::UsersController < Api::BaseController
  require_dependency 'api/v1/user_login'

  before_action -> { doorkeeper_authorize! :public, :write, :admin },
                only: :show
  before_action -> { doorkeeper_authorize! :public, :admin, :write },
                only: [:update, :update_preference]
  before_action -> { doorkeeper_authorize! :admin },
                only: [:extra_info, :filter_role]

  before_action :find_user, only: [:show_state, :show_brief, :token]
  before_action :verify_csrs!, only: [:show_state, :token]

  include Api::V1::UsersController::UserLogin

  def show
    render json: current_user, serializer: UserBasicSerializer
  end

  def show_brief
    render json: @user, each_serializer: UserBriefSerializer
  end

  def update
    user = current_user
    user.update!(user_params)
    render json: user
  end

  def extra_info
    white_list = %w(email mobile)
    querys = white_list & params[:query].collect(&:to_s)
    querys << 'is_old'
    render json: current_user.attributes.slice(*querys)
  end

  def update_preference
    current_user.preference&.update(preference_params)
    render json: { message: 'success' }
  end

  def count
    from, to = params.values_at(:from, :to)
    if from.blank? || to.blank?
      render json: { error: 'Missing parameters' }, status: 400
      return
    end

    count = User.where(created_at: from..to).count
    render json: { count: count }

  rescue ActiveRecord::StatementInvalid
    render json: { error: 'Invalid parameter value(s)' }, status: 400
  end

  def show_state
    Rails.logger.info("user is blank") unless @user
    return render json: { error: 'can not find user' }, status: 404 unless @user
    render json: @user, each_serializer: UserAdminBriefSerializer
  end

  def possible_roles
    render json: Role.roles
  end

  def token
    @client = Doorkeeper::Application.find_by_uid_and_secret(params[:key], params[:secret])
    token = Doorkeeper::AccessToken.find_or_create_for(@client, @user.id, @client.scopes, 7200, true)
    render json: { token: token.token }
  end

  private

  def preference_params
    params.permit(:receive_message,
                  email: [:enabled, subscriptions: [:event, :report]])
  end

  def user_params
    params.permit(:avatar, :realname, :nickname, :city, :company, :title, :bio)
  end

  def find_user
    user_id = params[:id] || params[:user_id]
    if user_id == 'from_access_key'
      @user = User.from_access_key(params[:access_key])
      return
    end

    if user_id == "token"
      doorkeeper_authorize!
      @user = current_user
      return
    end

    @user = User.where(id: params[:user_id].split(','))
  end
end
