class Device < ActiveRecord::Base
  belongs_to :user
  has_many :broadcasts_device_relations
  has_many :broadcasts, throught: :broadcasts_devices_relations

  validates :device_id, presence: true, uniqueness: true
end
