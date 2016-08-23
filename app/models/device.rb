class Device < ActiveRecord::Base
  belongs_to :user
  has_many :broadcasts_device_relations
  has_many :broadcasts, through: :broadcasts_devices_relations

  validates :device_id, presence: true, uniqueness: true
end
