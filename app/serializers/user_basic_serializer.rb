class UserBasicSerializer < ActiveModel::Serializer
  attributes :id, :nickname, :realname, :gender, :birthday, :city, :bio, :position, :avatar_url

  def city
    ChinaCity.get(object.city.to_s, prepend_parent: true)
  rescue NoMethodError
    ''
  end

  def position
    {
      company: object.company,
      title: object.title
    }
  end
end
