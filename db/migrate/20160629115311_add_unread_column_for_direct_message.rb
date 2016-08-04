class AddUnreadColumnForDirectMessage < ActiveRecord::Migration
  def change
    add_column :direct_messages, :unread, :boolean, default: true
  end
end
