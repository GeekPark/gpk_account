class UsersController < ApplicationController
  def new
  end

  def show
  end

  def update
  end

  def create
  end

  def send_verify_code
  end

  def check_exist
    render json: { exist: User.find_by_email_or_mobile(params[:loginname]).present? }
  end
end
