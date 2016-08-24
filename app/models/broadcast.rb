class Broadcast < ActiveRecord::Base
  has_many :broadcasts_devices_relations
  has_many :devices, through: :broadcasts_devices_relations
  has_one :user

  validates :content, presence: true, length: { maximum: 140 }

  enum content_type: [:activity, :topic]
end
