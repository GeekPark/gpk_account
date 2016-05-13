class AccessTokenSerializer < ActiveModel::Serializer
  attributes :access_token, :refresh_token, :expires_in

  def access_token
    object.token
  end
end
