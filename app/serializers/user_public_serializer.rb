class UserPublicSerializer < ActiveModel::Serializer
  attributes :id, :nickname, :city, :avatar_url, :company, :title, :bio

  def city
    ChinaCity.get(object.city.to_s, prepend_parent: true)
  rescue NoMethodError
    ''
  end
end
