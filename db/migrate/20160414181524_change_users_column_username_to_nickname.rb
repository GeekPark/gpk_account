class ChangeUsersColumnUsernameToNickname < ActiveRecord::Migration
  def up
    remove_index :users, :username
    rename_column :users, :username, :nickname
    add_index :users, :nickname
  end

  def down
    remove_index :users, :nickname
    rename_column :users, :nickname, :username
    add_index :users, :username, unique: true
  end
end
