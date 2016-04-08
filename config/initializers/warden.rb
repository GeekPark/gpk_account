Rails.application.config.middleware.insert_after ActionDispatch::Flash, Warden::Manager do |manager|
  manager.default_strategies :password
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
    u = User.find_by_email_or_mobile(params['loginname'])
    u.try(:authenticate, params['password']) ? success!(u) : fail!('Invalid account name or password')
  end
end
