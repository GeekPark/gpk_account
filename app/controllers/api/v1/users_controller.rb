class Api::V1::UsersController < Api::BaseController
  include Api::V1::UsersController::Login

  before_action -> { doorkeeper_authorize! :public, :write, :admin },
                only: [:show, :logout]
  before_action -> { doorkeeper_authorize! :admin, :write },
                only: [:update, :update_preference]
  before_action -> { doorkeeper_authorize! :admin },
                only: [:extra_info, :filter_role]
  before_action :verify_signature!, only: :third_part_login

  def show
    render json: current_user, serializer: UserBasicSerializer
  end

  def brief_info
    render json: User.find(params[:id]),
           serializer: UserBriefSerializer
  end

  def extra_info
    white_list = %w(email mobile)
    querys = white_list & params[:query].collect(&:to_s)
    querys << 'is_old'
    render json: current_user.attributes.slice(*querys)
  end

  def index
    users = User.all
    paginate json: users,
             per_page: 20,
             each_serializer: UserAdminBriefSerializer
  end

  def update
    user = current_user
    user.update!(user_params)
    render json: user
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

  def access_key
    if current_user
      render json: { access_key: current_user.access_key }
      return
    end

    render json: { error: t('errors.user_not_identified') }
  end

  def filter_role
    render json: Users.filter_role(param[:role]),
           serializer: UserBriefSerialize
  end

  private

  def preference_params
    params.permit(:receive_message,
                  email: [:enabled, subscriptions: [:event, :report]])
  end

  def user_params
    params.permit(:avatar, :realname, :nickname, :city, :company, :title, :bio)
  end
end
