class SessionsController < ApplicationController
  def new
    redirect_to root_url if current_user
    @error = { errors: [warden.message] }.to_json if warden.message.present?
  end

  def create
    warden.authenticate!
    redirect_to callback_url
  end

  def destroy
    warden.logout
    redirect_to login_url
  end
end
