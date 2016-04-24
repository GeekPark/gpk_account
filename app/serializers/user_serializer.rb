class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :nickname, :company, :title, :bio
end
