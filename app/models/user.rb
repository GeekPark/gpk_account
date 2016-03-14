class User < ActiveRecord::Base
  has_secure_password validations: false

  has_many :authorizations

  validates :email, presence: { if: proc { mobile.blank? } }
  validates :mobile, presence: { if: proc { email.blank? } }
end
