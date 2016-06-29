class AddTitleAndFromUserAndDirectIdToNotification < ActiveRecord::Migration
  def change
    add_column :notifications, :from_user_id, :uuid
    add_column :notifications, :direct_id, :string
    add_column :notifications, :title, :string
  end
end
