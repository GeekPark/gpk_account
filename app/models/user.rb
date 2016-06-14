class User < ActiveRecord::Base
  has_secure_password validations: false
  has_one  :preference
  has_many :authorizations
  has_many :devices
  has_many :notifications
  has_many :direct_messages
  has_many :access_tokens, -> { where revoked_at: nil }, class_name: 'Doorkeeper::AccessToken',
    foreign_key: 'resource_owner_id'

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
  validates :password, length: { in: 6..32 }, allow_nil: true
  validates :city, format: { with: /\A\d{6}\z/ }, allow_nil: true

  enum gender: {
    male:                   'male',
    female:                 'female',
    not_sure:               'not_sure',
    prefer_not_to_disclose: 'prefer_not_to_disclose'
  }

  enum role: { admin: 1 }
  after_update :revoke_all, if: :password_digest_changed?
  after_create -> { Preference.create(user: self) }

  mount_uploader :avatar, AvatarUploader
  has_one_time_password

  scope :recommends, -> { order('random()') }
  class << self
    def find_by_email_or_mobile(param)
      return unless param
      q = param.to_s.downcase
      find_by('lower(email) = ? OR mobile = ?', q, q)
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

  def generate_remember_token
    self.remember_token = SecureRandom.urlsafe_base64
    self.remember_token_created_at = Time.current

    save
    remember_token
  end

  def generate_identify_token
    token = SecureRandom.urlsafe_base64
    token.tap do |t|
      Rails.cache.write("identify_token:#{id}", t, expires_in: 1.hour)
    end
  end

  def identified?(token)
    (token.present? && token == Rails.cache.fetch("identify_token:#{id}")) || is_old? || sns_user?
  end

  def sns_user?
    email.blank? && mobile.blank?
  end

  def two_factor_qr
    update_attribute(:otp_secret_key, ROTP::Base32.random_base32)
    key = email.presence || mobile.presence || nickname.presence || 'noname'
    RQRCode::QRCode.new(provisioning_uri(key, issuer: 'GeekPark'))
                   .as_png(border_modules: 0).resize(200, 200).to_data_url
  end

  def two_factor_switch(code = nil)
    if two_factor_enable?
      update_attribute(:two_factor_enable, false)
    elsif otp_secret_key.present? && authenticate_otp(code.to_s, drift: 60)
      update_attribute(:two_factor_enable, true)
    end
    two_factor_enable?
  end

  def revoke_all
    access_tokens.each(&:revoke)
  end
end
