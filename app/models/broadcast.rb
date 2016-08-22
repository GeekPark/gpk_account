class Broadcast < ActiveRecord::Base
  has_many :broadcasts_devices_relations
  has_many :devices, throught: :broadcasts_devices_relations
end
