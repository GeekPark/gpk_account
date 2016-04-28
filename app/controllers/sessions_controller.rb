class SessionsController < ApplicationController
  def new
    redirect_to root_url if current_user
    warden.message.present? &&
      @error = { errors: ['invalid username or password'], login_name: warden.message }.to_json
  end

  def create
    warden.authenticate
    redirect_to callback_url
  end

  def destroy
    warden.logout
    redirect_to login_url
  end
end
