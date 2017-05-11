module HasRole
  extend ActiveSupport::Concern

  included do
    before_save :ensure_roles_existing
    before_save :ensure_roles_unique

    scope :filter_role, ->(x) { where('? in roles', x) }
  end

  def ensure_roles_existing
    return if roles.present?
    roles << Role.default
  end

  def ensure_roles_unique
    roles.uniq!
  end
end
