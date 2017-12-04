class UserBasicSerializer < ActiveModel::Serializer
  attributes :id, :nickname, :city, :realname, :gender, :birthday, :company, :title, :bio, :avatar_url, :banned, :created_days, :mobile, :email

  def city
    ChinaCity.get(object.city.to_s, prepend_parent: true)
  rescue NoMethodError
    ''
  end

  def created_days
    Rails.cache.fetch(['current_user', object.id, 'created_days'], expires_in: 1.days) do
      ((Time.now - object.created_at.to_time)/1.day).round
    end
  end
end
