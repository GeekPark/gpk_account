class AuthorizationSerializer < ActiveModel::Serializer
  attributes :id, :provider, :uid
end
