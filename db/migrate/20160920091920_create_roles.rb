class CreateRoles < ActiveRecord::Migration
  def change
    create_table :roles, id: :uuid, default: 'uuid_generate_v4()' do |t|
      t.string :name
      t.string :slug

      t.timestamps null: false
    end

    create_table :roles_users, id: :uuid, default: 'uuid_generate_v4()' do |t|
      t.uuid :role_id
      t.uuid :user_id
    end
  end
end
