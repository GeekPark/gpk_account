class User < ActiveRecord::Base
  has_secure_password validations: false
  has_many :authorizations

  validates :mobile, presence: { message: 'email and mobile at least have one' },
                     on: :create, if: ->(user) { user.email.blank? }
  validates_absence_of :password, message: 'please set the email or mobile first',
                                  if: ->(user) { user.email.blank? && user.mobile.blank? }
  validates :mobile, uniqueness: true, allow_nil: true
  validates :email, uniqueness: true, allow_nil: true

  class << self
    def find_by_email_or_mobile(param)
      find_by('email = ? OR mobile = ?', param, param) if param
    end

    def create_with_omniauth(auth)
      ActiveRecord::Base.transaction do
        user = User.new(nickname: auth['info']['nickname'])
        user.save(validate: false)
        user.authorizations.create!(provider: auth['provider'], uid: auth['uid'])
        user
      end
    rescue ActiveRecord::RecordInvalid
      nil
    end
  end
end
