class AddIsOldToUser < ActiveRecord::Migration
  def change
    add_column :users, :is_old, :boolean, default: false
  end
end
