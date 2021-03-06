class Api::BaseController < ActionController::API
  include ActionController::Serialization
  include ActionView::Helpers::TranslationHelper

  rescue_from(ActionController::ParameterMissing) do |err|
    render json: { error: 'ParameterInvalid', message: err.message }, status: 400
  end
  rescue_from(ActiveRecord::RecordInvalid) do |err|
    render json: { error: 'RecordInvalid', message: err.message }, status: 400
  end
  rescue_from(ActiveRecord::RecordNotFound) do
    render json: { error: 'ResourceNotFound' }, status: 404
  end
  rescue_from(VerifyCodeInvalid) do
    render json: { error: t('errors.invalid_verify_code') }, status: 422
  end

  rescue_from(OAuth2::Error) do
    render json: { error: 'Oauth2Error', message: 'Authorize failed' }, status: 400
  end

  def requires!(name, opts = {})
    raise(ActionController::ParameterMissing, name) if params[name].blank?

    if opts[:values]
      values = opts[:values]
      raise(ParameterValueNotAllowed, name) unless values.include?(params[name])
    end
  end

  def doorkeeper_authorize!(*scopes)
    request.env['warden'].custom_failure!
    super
  end

  def doorkeeper_unauthorized_render_options(*)
    { json: { error: 'Invalid token' } }
  end

  protected

  def current_user
    if params[:access_key]
      return User.from_access_key(params[:access_key])
    end
    Rails.logger.info("当前用户")
    Rails.logger.info(doorkeeper_token)
    User.find_by_id(doorkeeper_token.resource_owner_id) if doorkeeper_token
  end

  def verify_signature!
    @client = Doorkeeper::Application.find_by!(uid: params[:client_id])
    unless params[:signature] == sign(@client.secret) && verify_timestamp
      render json: { error: 'Signature verify failed.' }, status: 422
    end
  end

  # verify Cross-Site Request Signature
  def verify_csrs!
    if (-1..1).all? { |i| csrs_signature(i) != params[:csrs] }
      render json: { error: 'CSRS verification failed.' }, status: 422
    end
  end

  def sign(secret)
    flatted_hash = params.except(*request.path_parameters.keys, :signature).flatten_nested
    Digest::SHA256.hexdigest(flatted_hash.sort.flatten.join + secret)
  end

  def csrs_signature(error_tolerance_offset)
    timestamp_id = Time.now.to_i / 300
    timestamp = (timestamp_id + error_tolerance_offset).to_s(2)

    cross_site_key = ENV['CROSS_SITE_REQUEST_KEY']
    Digest::SHA256.hexdigest(timestamp + cross_site_key)
  end

  def verify_timestamp
    Time.zone.at(params[:timestamp].to_i).between? 10.minutes.ago, 10.minutes.since
  end
end
