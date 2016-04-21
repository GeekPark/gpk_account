class UserSerializer < ActiveModel::Serializer
  attributes :id, :nickname, :company, :title, :bio
end
