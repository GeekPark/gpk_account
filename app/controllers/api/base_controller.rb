class Api::BaseController < ActionController::API
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
  rescue_from(VerifyCodeInvalid) do
    render json: { error: 'Verify code invalid' }, status: 422
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

  private

  def current_user
    User.find(doorkeeper_token.resource_owner_id) if doorkeeper_token
  end

  def verify_signature!
    @client = Doorkeeper::Application.find_by!(uid: params[:client_id])
    unless params[:signature] == sign(@client.secret) && verify_timestamp
      (render json: { error: 'Signature verify failed.' }, status: 422) && return
    end
  end

  def sign(secret)
    flatted_hash = params.except(*request.path_parameters.keys, :signature).flatten_nested
    Digest::SHA256.hexdigest(flatted_hash.sort.flatten.join + secret)
  end

  def verify_timestamp
    Time.zone.at(params[:timestamp].to_i).between? 10.minutes.ago, 10.minutes.since
  end
end
