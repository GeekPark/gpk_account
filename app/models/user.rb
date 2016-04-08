class User < ActiveRecord::Base
  has_secure_password validations: false
  has_many :authorizations

  validates :mobile, presence: { message: 'email and mobile at least have one' },
                     on: :create, if: ->(user) { user.email.blank? }
  validates_absence_of :password, message: 'please set the email or mobile first',
                                  if: ->(user) { user.email.blank? && user.mobile.blank? }

  def self.find_by_email_or_mobile(param)
    find_by('email = ? OR mobile = ?', param, param) if param
  end
end
