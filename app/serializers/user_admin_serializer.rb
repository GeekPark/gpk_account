class UserAdminSerializer < UserSerializer
  attributes :roles, :wechat_enabled, :weibo_enabled, :banned
end
