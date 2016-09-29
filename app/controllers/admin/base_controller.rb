class Admin::BaseController < ApplicationController
  rescue_from CantCantCant::PermissionDenied do
    respond_to do |format|
      format.html { render_404 }
      format.json { render json: { errors: ['permission denial'] }, status: 404 }
    end
  end

  layout 'admin'
end
