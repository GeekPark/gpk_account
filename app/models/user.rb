class User < ActiveRecord::Base
  include HasRole
  include HasAccessKey
  include SmartFilterable

  has_secure_password validations: false
  has_one  :preference
  has_many :authorizations, dependent: :destroy
  has_many :devices
  has_many :notifications
  has_many :direct_messages
  has_many :access_tokens, -> { where revoked_at: nil },
           class_name: 'Doorkeeper::AccessToken',
    foreign_key: 'resource_owner_id'

  validates_absence_of :password,
                       message: 'please set the email or mobile first',
                       if: ->(user) { user.email.blank? && user.mobile.blank? }
  validates :mobile, uniqueness: true,
            format: { with: /\A\d{11}\z/,
                      message: 'only 11 numbers china mobile' },
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

  after_update :revoke_all, if: :password_digest_changed?
  after_create -> { Preference.create(user: self) }
  after_create :set_default_nickname

  mount_uploader :avatar, AvatarUploader
  has_one_time_password

  class << self
    def find_by_email_or_mobile(param)
      return unless param
      q = param.to_s.downcase
      find_by('lower(email) = ? OR mobile = ?', q, q)
    end

    def create_with_omniauth(auth)
      skip_callback(:create, :after, :set_default_nickname)
      ActiveRecord::Base.transaction do
        user = User.new(nickname: auth['info']['nickname'],
                        remote_avatar_url: auth['info']['avatar'])
        user.save(validate: false)
        user.authorizations.create!(provider: auth['provider'],
                                    uid: auth['uid'])
        user
      end
    rescue ActiveRecord::RecordInvalid
      nil
    ensure
      set_callback(:create, :after, :set_default_nickname)
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
    (token.present? && token == Rails.cache.fetch("identify_token:#{id}")) ||
      is_old? ||
      sns_user?
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

  def unread_dm_between(user_id)
    DirectMessage.where('user_id = ? and to_user_id = ?', user_id, id).unread
  end

  def wechat_enabled
    authorizations.any? { |auth| auth.provider == 'wechat' }
  end

  def weibo_enabled
    authorizations.any? { |auth| auth.provider == 'weibo' }
  end

  def attributes
    super.merge('weibo_enabled': weibo_enabled,
                 'wechat_enabled': wechat_enabled)
  end

  def set_default_nickname
    update_columns(nickname: "极客#{SecureRandom.random_number(9_999_999)}")
  end
end
