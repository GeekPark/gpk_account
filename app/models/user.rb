class User < ActiveRecord::Base
  has_secure_password validations: false
  has_many :authorizations

  validates :mobile, presence: { message: 'email and mobile at least have one' },
                     on: :create, if: ->(user) { user.email.blank? }
  validates_absence_of :password, message: 'please set the email or mobile first',
                                  if: ->(user) { user.email.blank? && user.mobile.blank? }
  validates :mobile, uniqueness: true,
            format: { with: /\A\d{11}\z/, message: 'only 11 numbers china mobile' },
            allow_nil: true
  validates :email, uniqueness: { case_sensitive: false },
            format: { with: /\A[^@]+@([^@\.]+\.)+[^@\.]+\z/ },
            allow_nil: true
  validates :nickname, length: { in: 2..20 }, allow_nil: true
  validates :password, length: { in: 6..20 }, allow_nil: true
  validates :city, format: { with: /\A\d{6}\z/ }, allow_nil: true

  enum gender: {
    male:                   'male',
    female:                 'female',
    not_sure:               'not_sure',
    prefer_not_to_disclose: 'prefer_not_to_disclose'
  }

  mount_uploader :avatar, AvatarUploader

  class << self
    def find_by_email_or_mobile(param)
      find_by('email = ? OR mobile = ?', param, param) if param
    end

    def create_with_omniauth(auth)
      ActiveRecord::Base.transaction do
        user = User.new(nickname: auth['info']['nickname'], remote_avatar_url: auth['info']['avatar'])
        user.save(validate: false)
        user.authorizations.create!(provider: auth['provider'], uid: auth['uid'])
        user
      end
    rescue ActiveRecord::RecordInvalid
      nil
    end
  end

  def authenticate(password)
    super(password)
  rescue BCrypt::Errors::InvalidHash
    nil
  end
end
