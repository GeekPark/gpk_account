class AddRememberTokenToUsers < ActiveRecord::Migration
  def change
    add_column :users, :remember_token, :string
    add_column :users, :remember_token_created_at, :datetime

    add_index :users, :remember_token, unique: true
  end
end
