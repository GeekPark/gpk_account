require "#{Rails.root}/lib/extras/warden_mixin"

Rails.application.config.middleware.insert_after ActionDispatch::Flash, Warden::Manager do |manager|
  manager.failure_app = ->(env) { SessionsController.action(:new).call(env) }
  manager.default_scope = :user
  manager.scope_defaults :user, strategies: [:password, :omniauth]
  manager.scope_defaults :cookie, strategies: [:cookie]
end

Warden::Manager.serialize_into_session(&:id)

Warden::Manager.serialize_from_session do |id|
  User.find(id)
end

Warden::Manager.before_logout do |user, auth, _opts|
  user.update_attribute :remember_token, nil if user.remember_token
  auth.cookies.delete(:remember_token)
  auth.cookies.delete(:remember_user)
end

Warden::Strategies.add(:password) do
  def valid?
    params['login_name'] && params['password']
  end

  def authenticate!
    user = User.find_by_email_or_mobile(params['login_name'])
    if user.try(:authenticate, params['password'])
      store_cookie(user) if params[:remember_me]
      success!(user)
    else
      fail!(params['login_name'])
    end
  end

  def store_cookie(user)
    cookies[:remember_user] = user.id
    cookies[:remember_token] = user.generate_remember_token
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

Warden::Strategies.add(:cookie) do
  def valid?
    cookies[:remember_token].present? && cookies[:remember_user].present?
  end

  def authenticate!
    user = User.find_by_id_and_remember_token(cookies[:remember_user], cookies[:remember_token])
    if user && user.remember_token_created_at > 30.days.ago
      success!(user)
    else
      cookies.delete(:remember_token)
      cookies.delete(:remember_user)
      fail!
    end
  end
end
