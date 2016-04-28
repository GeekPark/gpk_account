class SettingsController < ApplicationController
  before_action :require_login
  before_action :authenticate_password, only: :update_password

  def update_password
    if current_user.update(password: params[:new_password])
      render json: { user: current_user }
    else
      render json: { errors: current_user.errors.full_messages }
    end
  end

  private

  def authenticate_password
    unless current_user.authenticate(params[:password])
      render json: { errors: ['Password invalid'] }, status: :not_acceptable
      return
    end
  end
end
