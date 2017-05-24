class AddRolesToUsers < ActiveRecord::Migration
  def change
    add_column :users, :roles, :string, array: true, default: []

    reversible do |dir|
      dir.up do
        User.where(role: 1).update_all(roles: [:admin, :user])
        User.where(role: nil).update_all(roles: [:user])
      end

      dir.down do
        User.where('? != ALL(roles)', 'admin').update_all(role: nil)
        User.where('? = ANY(roles)', 'admin').update_all(role: 1)
      end
    end

    remove_column :users, :role, :integer
  end
end
