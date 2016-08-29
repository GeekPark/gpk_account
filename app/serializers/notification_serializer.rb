class NotificationSerializer < ActiveModel::Serializer
  attributes :content_type, :content, :parent_id, :unread, :created_at, :time_created_at, :title, :direct_id

  has_one :from_user, serializer: UserBasicSerializer

  def time_created_at
    object.created_at&.to_i
  end
end
