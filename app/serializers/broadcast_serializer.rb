class BroadcastSerializer < ActiveModel::Serializer
  attributes :id, :content, :content_type, :time_send_at, :redirect, :time_created_at

  def time_created_at
    object.created_at&.to_i
  end

  def time_send_at
    object.send_at&.to_i
  end
end
