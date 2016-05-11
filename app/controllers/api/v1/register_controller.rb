class Api::V1::RegisterController < ApplicationController
  include Verifiable
  before_action :verify_signature!, only: :register
  before_action :verify_rucaptcha!, only: :send_verify_code

  def captcha
    hex = SecureRandom.hex
    captcha = RuCaptcha::Captcha.random_chars
    Rails.cache.write "captcha_key:#{hex}", captcha, expired_in: 2.minutes
    response.headers['captcha_key'] = hex
    send_data RuCaptcha::Captcha.create(captcha)
  end

  def register
    verify_code?(params[:user][:email] || params[:user][:mobile])
    user = User.create!(user_params)
    token = Doorkeeper::AccessToken.create!(
      application_id: @client.id,
      resource_owner_id: user.id,
      expires_in: 7200, use_refresh_token: true)
    render json: { access_token: token.token, refresh_token: token.refresh_token, expires_in: token.expires_in }
  end

  private

  def user_params
    params.require(:user).permit(:email, :mobile, :password)
  end

  def verify_rucaptcha!
    right = params[:captcha_key].present? && params[:captcha].present? &&
      Rails.cache.read("captcha_key:#{params[:captcha_key]}") == params[:captcha]

    (render json: { error: 'Captcha invalid' }, status: 422) && return unless right
  end

  def verify_signature!
    @client = Doorkeeper::Application.find(uid: params[:client_id])
    unless params[:signature] == sign(@client.secret) && verify_timestamp
      (render json: { error: 'Signature verify failed.' }, status: 422) && return
    end
  end

  def sign(secret)
    flatted_hash = flatten_hash params.except(*request.path_parameters.keys, :signature)
    Digest::SHA256.hexdigest(flatted_hash.sort.flatten.join + secret)
  end

  def verify_timestamp
    Time.zone.at(params[:timestamp].to_i).between? 10.minutes.ago, 10.minutes.since
  end

  def flatten_hash(hash)
    hash.each_with_object({}) do |(k, v), h|
      if v.is_a? Hash
        flatten_hash(v).map do |h_k, h_v|
          h["#{k}.#{h_k}".to_sym] = h_v
        end
      else
        h[k] = v
      end
    end
  end
end
