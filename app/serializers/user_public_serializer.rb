class UserPublicSerializer < ActiveModel::Serializer
  attributes :id, :nickname, :city, :avatar_url, :company, :title, :bio
end
