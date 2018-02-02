class NotificationSerializer < ActiveModel::Serializer
  attributes :id, :content_type, :content, :parent_id, :unread, :created_at, :time_created_at, :title, :direct_id, :comment, :parent_type, :comment_id

  has_one :from_user, serializer: UserBasicSerializer

  def time_created_at
    object.created_at&.to_i
  end

  def parent_type
    Rails.cache.fetch(['parent_type', object.id, object.direct_id]) do
      if Faraday.get(ENV["MAIN_BASE"] + "posts/#{object.direct_id}").success?
        "post"
      else
        "question"
      end
    end
  end
end
