class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :nickname, :mobile, :city, :avatar, :company, :title, :bio
end
