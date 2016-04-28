class AddBirthdayAndGenderAndRealnameToUsers < ActiveRecord::Migration
  def up
    execute <<-SQL
      CREATE TYPE gender AS ENUM ('male', 'female', 'not_sure', 'prefer_not_to_disclose');
    SQL

    add_column :users, :gender, :gender, index: true, default: 'not_sure'
    add_column :users, :birthday, :date
    add_column :users, :realname, :string
  end

  def down
    remove_column :users, :realname
    remove_column :users, :birthday
    remove_column :users, :gender

    execute <<-SQL
      DROP TYPE gender;
    SQL
  end
end
