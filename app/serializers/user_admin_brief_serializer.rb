class UserAdminBriefSerializer < ActiveModel::Serializer
  attributes :id,
             :email,
             :nickname,
             :mobile,
             :avatar_url,
             :realname,
             :roles,
             :wechat_enabled,
             :weibo_enabled
end
