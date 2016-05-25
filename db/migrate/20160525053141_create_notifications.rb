class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications, id: :uuid, default: "uuid_generate_v4()" do |t|
      t.uuid :user_id
      t.integer :content_type
      t.string :content
      t.uuid :parent_id
      t.boolean :unread, default: true

      t.timestamps null: false
    end

    add_column :users, :unread_notifications_count, :integer, null: false, default: 0
    add_index :notifications, :user_id
  end
end
