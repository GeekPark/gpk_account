module Pushable
  extend ActiveSupport::Concern

  def set_notification_info(title: '', extra_info: {}, to: [])
    @title      = title
    @extra_info = extra_info
    @target     = to
    self
  end

  def quietly(quiet = true)
    @quiet = quiet
    self
  end

  def development_only(dev_only = true)
    @development_only = dev_only
    self
  end

  def jpush_notification(at: :now)
    payload = generate_payload

    return if Rails.env.test?

    case at
    when :now
      JPush::JPushClientPusher.push(payload)
    else
      scheduled_payload = JPush::Schedule::SchedulePayload.new(
        'test_task',
        JPush::Schedule::Trigger.new.set_single(at),
        payload
      )
      JPush::Schedule.create(scheduled_payload)
    end
  end

  private

  def generate_payload
    apns_prod = @development_only || Rails.env.production?
    JPush::Push::PushPayload.new(
      platform:     %w(ios android),
      audience:     target_audience,
      notification: to_jpush_notification,
      message:      'hello'
    ).set_options(apns_production: apns_prod)
  end

  def ios_options
    options = {
      alert:            @title,
      contentavailable: false,
      mutablecontent:   nil,
      category:         nil,
      extras: { data: @extra_info, type: self.class.notifi_type }
    }

    unless @quietly
      options[:sound] = 'sosumi.aiff'
      options[:badge] = 1
    end

    options
  end

  def android_options
    options = {
      alert: @title,
      extras: { data: @extra_info, type: self.class.notifi_type }
    }
    options[:alert_type] = 0 if @quitely
    options
  end

  def to_jpush_notification
    notification = JPush::Push::Notification.new
    notification.set_ios     ios_options
    notification.set_android android_options
  end

  def target_audience
    reg_ids =
      if @target == :all || @target == 'all'
        'all'
      elsif Rails.env.test? || !@target.is_a?(Array)
        []
      else
        @target.map { |u| u.devices.most_recent.registration_id }.compact
      end

    audience = JPush::Push::Audience.new
    audience.set_registration_id(reg_ids)
  end

  class_methods do
    attr_reader :notifi_type
    def notification_type(type)
      @notifi_type = type if %w(broadcast notification).include?(type)
    end
  end
end
