class Admin::BaseController < ApplicationController
  before_action :require_admin

  rescue_from PermissionError do
    respond_to do |format|
      format.html { render_404 }
      format.json do
        render json: { errors: ['permission denial'] },
               status: 404
      end
    end
  end

  layout 'admin'

  private

  def require_admin
    raise PermissionError unless current_user && current_user.admin?
  end
end
