class CreateDevices < ActiveRecord::Migration
  def change
    create_table :devices, id: :uuid, default: "uuid_generate_v4()" do |t|
      t.uuid :user_id
      t.string :device_id, unique: true
      t.datetime :last_actived_time

      t.timestamps null: false
    end

    add_index :devices, :device_id, unique: true
    add_index :devices, :user_id, unique: true
  end
end
