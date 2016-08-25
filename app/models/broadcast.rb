class Broadcast < ActiveRecord::Base
  has_many :broadcasts_devices_relations
  has_many :devices, through: :broadcasts_devices_relations
  has_one :user
  after_create :push_broadcast

  validates :content, presence: true, length: { maximum: 140 }

  enum content_type: [:activity_type, :topic_type]

  def push_broadcast
    if send_at
      delay = Time.now.getlocal - send_at
      BroadcastJob.perform_in(delay, id)
    else
      BroadcastJob.preform_async(id)
    end
  end
end