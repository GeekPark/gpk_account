class CreateDirectMessages < ActiveRecord::Migration
  def change
    enable_extension 'uuid-ossp'

    create_table :direct_messages, id: :uuid, default: "uuid_generate_v4()" do |t|

      t.uuid :user_id, null: false
      t.uuid :to_user_id, null: false

      t.integer :content_type, null: false, default: 1
      t.string :content
      t.string :media_content

      t.timestamps null: false
    end

    add_index :direct_messages, [:user_id,:to_user_id]
    add_index :direct_messages, [:to_user_id,:user_id]
    add_index :direct_messages, :created_at
  end
end
