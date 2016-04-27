class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :nickname, :mobile, :avatar_url, :city, :company, :title, :bio
end
