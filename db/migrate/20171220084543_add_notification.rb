class AddNotification < ActiveRecord::Migration
  def change
  	add_column :notifications, :comment_id, :string
  end
end
