class DirectMessageSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :to_user_id, :content_type, :content, :time_created_at

  def time_created_at
    object.created_at.to_i
  end

  has_one :user, serializer: UserBasicSerializer
  has_one :to_user, serializer: UserBasicSerializer
end
