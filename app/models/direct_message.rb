class DirectMessage < ActiveRecord::Base
  belongs_to :user
  belongs_to :to_user, class_name: 'User'
  validates :content_type, inclusion: { in: %w(txt image audio video) }

  enum content_type: { txt: 1, image: 2, audio: 3, video: 4 }

  mount_uploader :media_content, MediaUploader

  default_scope { order(created_at: :desc) }

  def self.between(user_id, to_user_id)
    includes(:user, :to_user).where(
      '(user_id = ? and to_user_id = ?) or (user_id = ? and to_user_id = ? )',
      user_id,
      to_user_id,
      to_user_id,
      user_id
    )
  end

  def self.list(user)
    includes(:user, :to_user).joins("RIGHT JOIN
      (select to_user_id, MAX(created_at) as created_at
      FROM direct_messages
      WHERE user_id = '#{user.id}' OR to_user_id = '#{user.id}'
      GROUP BY to_user_id) T
      ON T.to_user_id = direct_messages.to_user_id AND T.created_at = direct_messages.created_at")
  end
end
