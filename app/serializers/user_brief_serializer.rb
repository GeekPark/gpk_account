class UserBriefSerializer < ActiveModel::Serializer
  attributes :id, :nickname, :avatar_url
end
