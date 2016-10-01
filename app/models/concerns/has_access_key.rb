module HasAccessKey
  extend ActiveSupport::Concern

  def access_key
    key = generate_access_key
    value = "#{id}:#{roles.join(',')}"
    Rails.cache.write("access_key:#{key}", value, expires_in: 2.hours)
    key
  end

  class_methods do
    def from_access_key(key)
      info = Rails.cache.read("access_key:#{key}")
      return if info.blank?

      user_id, = info.split(':')
      user = find_by(id: user_id)
      return if user.blank?

      user
    end
  end

  private

  def generate_access_key
    SecureRandom.uuid
  end
end
