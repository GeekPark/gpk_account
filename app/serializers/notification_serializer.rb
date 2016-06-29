class NotificationSerializer < ActiveModel::Serializer
  attributes :content_type, :content, :parent_id, :unread, :created_at, :title, :direct_id

  has_one :from_user, serializer: UserBasicSerializer
end
