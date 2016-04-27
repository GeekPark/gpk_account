class UserPublicSerializer < ActiveModel::Serializer
  attributes :id, :nickname, :city, :avatar, :company, :title, :bio
end
