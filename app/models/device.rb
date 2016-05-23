class Device < ActiveRecord::Base
  belongs_to :user

  validates :device_id, presence: true, uniqueness: true
end
