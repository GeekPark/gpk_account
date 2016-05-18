class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :nickname, :mobile, :avatar_url, :realname, :gender,
    :birthday, :city, :company, :title, :bio, :is_old
  has_many :authorizations

  def mobile
    object.mobile&.gsub(/(?<=\d{3})\d(?=\d{4})/, '*')
  end

  def email
    object.email&.gsub(/(?!\A).+(?=@)/, '****')
  end
end
