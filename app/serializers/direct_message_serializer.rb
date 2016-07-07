class DirectMessageSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :to_user_id, :content_type, :content, :time_created_at, :unread_count

  def time_created_at
    object.created_at.to_i
  end

  def unread_count
    current_user = serialization_options[:current_user]
    return 0 unless current_user
    current_user.unread_dm_between((current_user&.id == user_id) ? to_user_id : user_id).count
  end

  has_one :user, serializer: UserBasicSerializer
  has_one :to_user, serializer: UserBasicSerializer
end
