module HasAccessKey
  extend ActiveSupport::Concern

  def access_key
    key = generate_access_key
    value = "#{id}:#{roles.join(',')}"
    self.class.local_redis.write(
      "access_key:#{key}",
      value,
      expires_in: 2.hours
    )
    key
  end

  private

  def generate_access_key
    SecureRandom.uuid
  end

  class_methods do
    def from_access_key(key)
      info = local_redis.read("access_key:#{key}")
      return if info.blank?

      user_id, = info.split(':')
      user = find_by(id: user_id)
      return if user.blank?

      user
    end

    def local_redis
      return Rails.cache if Rails.env.test?
      return @access_key_redis if @access_key_redis
      @access_key_redis ||= Redis.new(
        url: ENV['ACCESS_KEY_REDIS_URL'] || 'redis://127.0.0.1/0/master'
      )
      @access_key_redis.singleton_class.class_eval do
        alias_method :read, :get
        alias_method :write, :set
      end
      @access_key_redis
    end
  end
end
