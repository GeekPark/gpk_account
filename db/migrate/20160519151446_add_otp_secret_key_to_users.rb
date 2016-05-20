class AddOtpSecretKeyToUsers < ActiveRecord::Migration
  def up
    add_column :users, :otp_secret_key, :string
    add_column :users, :two_factor_enable, :boolean
  end

  def down
    remove_column :users, :two_factor_enable
    remove_column :users, :otp_secret_key
  end
end
