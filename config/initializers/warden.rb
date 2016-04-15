Rails.application.config.middleware.insert_after ActionDispatch::Flash, Warden::Manager do |manager|
  manager.default_strategies :password, :omniauth
  manager.failure_app = ->(env) { SessionsController.action(:new).call(env) }
end

Warden::Manager.serialize_into_session(&:id)

Warden::Manager.serialize_from_session do |id|
  User.find(id)
end

Warden::Strategies.add(:password) do
  def valid?
    params['loginname'] && params['password']
  end

  def authenticate!
    user = User.find_by_email_or_mobile(params['loginname'])
    user.try(:authenticate, params['password']) ? success!(user) : fail!('Invalid account name or password')
  end
end

Warden::Strategies.add(:omniauth) do
  def valid?
    request.env['omniauth.auth']
  end

  def authenticate!
    auth = request.env['omniauth.auth']
    authorization = Authorization.find_by_provider_and_uid(auth['provider'], auth['uid'])
    user = authorization.try(:user) || User.create_with_omniauth(auth)
    success!(user)
  end
end
