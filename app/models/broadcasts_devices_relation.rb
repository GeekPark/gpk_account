class BroadcastsDevicesRelation < ActiveRecord::Base
  belongs_to :broadcast
  belongs_to :device
end
