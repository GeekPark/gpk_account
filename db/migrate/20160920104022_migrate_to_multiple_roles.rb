# coding: utf-8

class MigrateToMultipleRoles < ActiveRecord::Migration
  def up
    mass_migrate_role(name: '用戶', slug: 'user') do
      User.where(role: nil).pluck(:id)
    end
    mass_migrate_role(name: '管理员', slug: 'admin') do
      User.admin.pluck(:id)
    end
  end

  def down
    ActiveRecord::Base.connection.execute(
      'TRUNCATE TABLE roles_users;' \
      'TRUNCATE TABLE roles'
    )
  end

  def mass_migrate_role(name: nil, slug: nil)
    role_id = Role.create(name: name, slug: slug).id
    data = yield.map { |uid| "('#{uid}', '#{role_id}')" }
    if data.present?
      sql = 'INSERT INTO roles_users (user_id, role_id) ' \
            "VALUES #{data.join(',')};"
      ActiveRecord::Base.connection.execute(sql)
    end
    say "#{data.length} user(s) migrated."
  end
end
