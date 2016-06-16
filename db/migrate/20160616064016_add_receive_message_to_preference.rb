class AddReceiveMessageToPreference < ActiveRecord::Migration
  def change
    add_column :preferences, :receive_message , :boolean, default: true
  end
end
