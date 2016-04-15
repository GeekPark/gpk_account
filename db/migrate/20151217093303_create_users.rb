class CreateUsers < ActiveRecord::Migration
  def change
    enable_extension 'uuid-ossp'

    create_table :users, id: :uuid, default: "uuid_generate_v4()" do |t|
      ## Database authenticatable
      t.string :email,              unique: true
      t.string :encrypted_password, null: false, default: ""

      ## User other keys
      t.string :username
      t.string :mobile,    unique: true
      t.string :wechat_id, unique: true

      ## Rememberable
      t.datetime :remember_created_at

      ## User Extra Info
      t.integer  :city
      t.string   :company
      t.string   :title
      t.string   :avatar
      t.text     :bio

      t.timestamps null: false
    end

    add_index :users, :email,                unique: true
    add_index :users, :username,             unique: true
    add_index :users, :mobile,               unique: true
    add_index :users, :wechat_id,            unique: true
  end
end
