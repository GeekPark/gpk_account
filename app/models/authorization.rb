class Authorization < ActiveRecord::Base
  belongs_to :user

  validates :platform, presence: true
  validates :open_id, presence: { if: proc { platform == 'wechat' } }
  validates :uid, presence: { if: proc { platform == 'weibo' } }
end
