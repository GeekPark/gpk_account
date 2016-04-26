module ShortMessage
  module_function

  attr_writer :config

  class Configuration
    include Singleton
    attr_accessor :api_key
    attr_accessor :debug_mode

    def self.defaults
      @defaults ||= {
        api_key: ENV['SMS_KEY'],
        debug_mode: false
      }
    end

    def initialize
      self.class.defaults.each_pair { |k, v| send("#{k}=", v) }
    end
  end

  def config
    Configuration.instance
  end

  def configure
    yield(config)
  end

  def send_verify_code(mobile)
    code = Rails.cache.fetch "verify_code:#{mobile}", expires_in: 30.minutes do
      rand(100_000..999_999).to_s
    end
    send_sms(mobile, code, 1_343_527)
  end

  def send_sms(mobile, code, tpl)
    if Rails.env.production? || config.debug_mode
      ChinaSMS.use :yunpian, password: config.api_key
      tpl_params = { code: code }
      result = ChinaSMS.to mobile, tpl_params, tpl_id: tpl
      result['code'] == 0
    else
      Rails.logger.debug code
    end
  end
end
