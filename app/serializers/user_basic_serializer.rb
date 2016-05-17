class UserBasicSerializer < ActiveModel::Serializer
  attributes :id, :nickname, :city, :realname, :gender, :birthday, :company, :title, :bio, :avatar_url

  def city
    ChinaCity.get(object.city.to_s, prepend_parent: true)
  rescue NoMethodError
    ''
  end
end
