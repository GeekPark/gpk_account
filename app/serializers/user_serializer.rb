class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :nickname, :mobile, :avatar_url, :realname, :gender,
    :birthday, :city, :company, :title, :bio, :is_old

  has_many :authorizations
end
