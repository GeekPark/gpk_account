class CreateBroadcasts < ActiveRecord::Migration
  def change
    create_table :broadcasts, id: :uuid, default: "uuid_generate_v4()" do |t|
      t.integer  :content_type, null: false, default: 1
      t.text     :content
      t.datetime :send_at
      t.uuid     :redirect_id
      t.uuid     :user_id

      t.timestamps null: false
    end
  end
end
