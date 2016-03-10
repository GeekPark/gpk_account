class CreateAuthorizations < ActiveRecord::Migration
  def change
    create_table :authorizations do |t|
      t.string :platform
      t.string :open_id
      t.string :union_id
      t.string :uid
      t.jsonb :info
      
      t.string :user_id

      t.timestamps null: false
    end

    add_index :authorizations, :open_id,  unique: true
    add_index :authorizations, :union_id, unique: true
    add_index :authorizations, :uid,      unique: true
    add_index :authorizations, :user_id,  unique: true
  end
end
