module HasRole
  extend ActiveSupport::Concern

  included do
    before_save :ensure_roles_existing
    before_save :ensure_roles_unique

    scope :filter_role,  ->(x) { where('? = ANY(roles)', x)  }
    scope :exclude_role, ->(x) { where('? <> ALL(roles)', x) }
  end

  def admin?
    'admin'.in? roles
  end

  def ensure_roles_existing
    return if roles.present?
    roles << Role.default
  end

  def ensure_roles_unique
    roles.uniq!
  end
end
