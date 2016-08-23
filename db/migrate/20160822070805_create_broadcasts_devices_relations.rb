class CreateBroadcastsDevicesRelations < ActiveRecord::Migration
  def change
    create_table :broadcasts_devices_relations, id: :uuid, default: "uuid_generate_v4()" do |t|
      t.uuid    :broadcast_id
      t.uuid    :device_id
      t.boolean :read, default: false

      t.timestamps null: false
    end

    add_index :broadcasts_devices_relations, :broadcast_id
    add_index :broadcasts_devices_relations, :device_id
  end
end
