class FixUserHasSecurePasswordAndDeleteWechatId < ActiveRecord::Migration
  def up
    remove_column :users, :wechat_id
    rename_column :users, :encrypted_password, :password_digest
  end

  def down
    add_column :users, :wechat_id, :string, unique: true
    rename_column :users, :password_digest, :encrypted_password
  end
end
