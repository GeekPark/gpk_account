class Broadcast < ActiveRecord::Base
  include Pushable
  notification_type 'broadcast'

  has_many :broadcasts_devices_relations
  has_many :devices, through: :broadcasts_devices_relations
  has_one :user
  after_create :push_broadcast

  validates :content, presence: true, length: { maximum: 140 }

  enum content_type: [:activity_type, :topic_type]
  scope :sent, lambda {
    where(
      'send_at <= :now or ' \
      '(send_at is NULL and created_at <= :now)',
      now: Time.now.getlocal
    )
  }

  scope :of_type, lambda { |type|
    if type && type.intern.in?(Broadcast.content_types)
      public_send(type)
    else
      all
    end
  }

  def push_broadcast
    Rails.logger.info("title是")
    Rails.logger.info(content)
    set_notification_info(
      title: content,
      extra_info: as_json,
      to: :all
    ).jpush_notification(at: send_at || :now)
  end

  def push_notification
    BroadcastsDevicesRelation.create(device_id: device.id, broadcast_id: id)
    set_notification_info(title: content, extra_info: as_json, to: :all)
      .jpush
  end
end
