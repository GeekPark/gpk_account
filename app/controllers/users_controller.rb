class UsersController < ApplicationController
  def show
    user = UserSerializer.new(current_user)
    @data = { user: user, city: get_city_list(user.city) }
    respond_to do |format|
      format.html
      format.json { render json: @data }
    end
  end

  def update
    current_user.update!(user_update_params)
    render json: current_user, serializer: UserSerializer
  end

  def check_exist
    user = User.find_by_email_or_mobile(login_name)
    render json: { exist: user.present?, avatar_url: user&.avatar_url }
  end

  def access_key
    if current_user
      render json: { access_key: current_user.access_key }
      return
    end

    render json: { error: t('errors.user_not_identified') }
  end

  private

  def user_update_params
    params.require(:user).permit(:nickname, :city, :company, :title, :avatar, :bio, :realname, :gender, :birthday)
  end

  def get_city_list(id)
    return [ChinaCity.list, nil, nil] if id.nil?
    [
      ChinaCity.list,
      ChinaCity.list("#{id / 1000}000"),
      ChinaCity.list("#{id / 100}00")
    ]
  end
end
