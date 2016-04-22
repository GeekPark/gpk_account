module ApplicationHelper
  def webpack_javascript_include_tag(name)
    if Rails.configuration.webpack[:manifest]
      asset_name = Rails.configuration.webpack[:manifest]["#{name}.js"]
      return unless asset_name.present?
    end
    src = cdn_assets_url(name, asset_name)
    "<script src=\"#{src}\"></script>".html_safe
  end

  private

  def cdn_assets_url(name, asset_name)
    if Rails.env.production?
      "#{Rails.configuration.cdn}/static/#{asset_name}"
    elsif asset_name.present?
      "/static/#{asset_name}"
    elsif request.port == 8080
      "/static/#{name}.js"
    else
      "//localhost:8080/static/#{name}.js"
    end
  end
end
