class Role < ActiveRecord::Base
  has_and_belongs_to_many :users

  validates_uniqueness_of :name, :slug

  class << self
    def user
      Role.find_or_create_by(slug: 'user', name: 'User')
    end
  end
end
