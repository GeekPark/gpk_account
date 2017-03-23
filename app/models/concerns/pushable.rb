module Pushable
  extend ActiveSupport::Concern
  included do
    @title      = ''
    @extra_info = {}
    @target     = []
    @quiet      = false
  end

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

  def jpush_notification(at: :now)
    check_target_and_env
    return if @target.blank?

    payload = generate_payload

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
    JPush::Push::PushPayload.new(
      platform:     'ios',
      audience:     generate_target_audience,
      notification: to_jpush_notification,
      message:      'hello'
    ).set_options(apns_production: Rails.env.production?)
  end

  def to_jpush_notification
    notification = JPush::Push::Notification.new
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
    notification.set_ios(**options)
  end

  def generate_target_audience
    return @target if @target == 'all'
    audience = JPush::Push::Audience.new
    audience.set_registration_id(@target)
  end

  def check_target_and_env
    @target = [] if Rails.env.test?
    return unless @target.is_a?(Array)
    @target = @target.map do |user|
      user.devices.order(last_actived_time: :desc).first&.registration_id
    end.compact
  end

  class_methods do
    attr_reader :notifi_type
    def notification_type(type)
      @notifi_type = type if %w(broadcast notification).include?(type)
    end
  end
end
