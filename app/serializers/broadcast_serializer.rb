class BroadcastSerializer < ActiveModel::Serializer
  attributes :id, :content, :content_type, :send_at, :redirect
end
