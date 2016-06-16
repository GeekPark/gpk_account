class Api::V1::DirectMessagesController < Api::BaseController
  before_action -> { doorkeeper_authorize! :write }
  before_action -> { verify_allow_send }, only: :create

  def create
    direct_message = current_user.direct_messages.create!(direct_messages_params)
    render json: direct_message
  end

  def index
    direct_messages = DirectMessage.list(current_user)
    paginate json: direct_messages, per_page: 20
  end

  def detail
    requires! :user_id
    direct_messages = DirectMessage.between(current_user.id, params[:user_id])
    paginate json: direct_messages, per_page: 20
  end

  def direct_messages_params
    params.permit(:to_user_id, :content_type, :content, :media_content)
  end

  private

  def verify_allow_send
    requires! :to_user_id
    allow = User.find(params[:to_user_id]).preference&.receive_message
    (render json: { error: t('errors.user_not_allow_send_email') }, status: 422) && return unless allow
  end
end
