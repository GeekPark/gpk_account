class NotificationSerializer < ActiveModel::Serializer
  attributes :content_type, :content, :parent_id, :unread, :created_at
end
