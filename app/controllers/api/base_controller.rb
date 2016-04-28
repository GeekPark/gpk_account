module Api
  class BaseController < ActionController::API
    include ActionController::Serialization

    rescue_from(ActionController::ParameterMissing) do |err|
      render json: { error: 'ParameterInvalid', message: err }, status: 400
    end
    rescue_from(ActiveRecord::RecordInvalid) do |err|
      render json: { error: 'RecordInvalid', message: err }, status: 400
    end
    rescue_from(ActiveRecord::RecordNotFound) do
      render json: { error: 'ResourceNotFound' }, status: 404
    end

    def generate_captcha
      hex = SecureRandom.hex
      captcha = RuCaptcha::Captcha.random_chars
      Rails.cache.write "captcha_key:#{hex}",captcha,expired_in: 10.minutes
      response.headers['captcha_key'] = hex
      send_data RuCaptcha::Captcha.create(captcha)
    end
    private

    def current_user
      User.find(doorkeeper_token.resource_owner_id) if doorkeeper_token
    end
    def captcha_validate?
      params[:captcha_key].present? && params[:captcha].present? \
        && Rails.cache.read("captcha_key:#{params[:captcha_key]}") == params[:captcha]
    end
  end
end
