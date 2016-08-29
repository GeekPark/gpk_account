class BroadcastsDevicesRelation < ActiveRecord::Base
  belongs_to :broadcast
  belongs_to :device

  scope :activity_type, -> { includes('broadcast').where('broadcasts.content_type = 0').references(:broadcast) }
end
