class AddCommentToNotifications < ActiveRecord::Migration
  def change
    add_column :notifications, :comment, :string
  end
end
