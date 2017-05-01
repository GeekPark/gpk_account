class AddRegistrationIdForDevice < ActiveRecord::Migration
  def change
    add_column :devices, :registration_id, :string, index: true
  end
end
