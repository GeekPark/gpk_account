class ChangeNotification < ActiveRecord::Migration
  def change
    change_column :notifications, :parent_id, :string
  end
end
