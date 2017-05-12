class Api::V1::UsersController < Api::BaseController
  require_relative 'user_login'
  require_relative 'user_management'

  before_action -> { doorkeeper_authorize! :public, :write, :admin },
                only: :show
  before_action -> { doorkeeper_authorize! :admin, :write },
                only: [:update, :update_preference]
  before_action -> { doorkeeper_authorize! :admin },
                only: [:extra_info, :filter_role]

  include Api::V1::UsersController::UserLogin
  include Api::V1::UsersController::UserManagement

  def show
    render json: current_user, serializer: UserBasicSerializer
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

  def access_key
    if current_user
      render json: { access_key: current_user.access_key }
      return
    end

    render json: { error: t('errors.user_not_identified') }
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
