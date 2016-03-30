class CreateAuthorizations < ActiveRecord::Migration
  def change
    create_table :authorizations do |t|
      t.string     :provider
      t.string     :uid
      t.uuid       :user_id

      t.timestamps null: false
    end
    add_index :authorizations, [:provider, :uid]
    add_index :authorizations, :user_id
  end
end
