class SessionsController < ApplicationController
  def new
  end

  def create
    warden.authenticate!
    render nothing: true
  end

  def destroy
    warden.logout
    render nothing: true
  end
end
