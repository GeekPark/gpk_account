class UserSerializer < ActiveModel::Serializer
  attributes :id,
             :email,
             :nickname,
             :mobile,
             :avatar_url,
             :realname,
             :gender,
             :birthday,
             :city,
             :company,
             :title,
             :bio,
             :is_old,
             :two_factor_enable,
             :preference,
             :roles,
             :banned

  has_many :authorizations
  has_one :preference

  def mobile
    object.mobile&.sub(/(?<=\d{3})\d(?=\d{4})/, '*')
  end

  def email
    object.email&.sub(/(?!\A).+(?=@)/, '****')
  end

  def serializable_hash
    Rails.cache.fetch(cache_key, expires_in: 2.hours) { super }
  end
end
