class CreateDevices < ActiveRecord::Migration
  def change
    create_table :devices, id: false do |t|
      t.string :device_id, primary_key: true
      t.uuid :user_id
      t.datetime :last_actived_time

      t.timestamps null: false
    end
  end
end
