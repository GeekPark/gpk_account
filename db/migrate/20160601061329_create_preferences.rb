class CreatePreferences < ActiveRecord::Migration
  def change
    create_table :preferences, id: false do |t|
      t.uuid       :user_id, primary_key: true
      t.jsonb      :email, default: '{}'
      t.timestamps null: false
    end
  end
end
