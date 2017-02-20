module Pushable
  extend ActiveSupport::Concern
  included do
    @title = ''
    @extra_info = {}
    @target = []
  end

  # target is 'all' or user_array
  def set_target
    target = yield if block_given?
    return if target.blank?
    @target = @target.map { |u| u.id.to_s } if @target.is_a?(Array)
    @target = target
    self
  end

  def set_notification_info(title, extra_info, target = [])
    @title      = title
    @extra_info = extra_info
    @target     = target
    self
  end

  def jpush_at(time)
    single = JPush::Schedule::Trigger.new.set_single(time)
    payload = JPush::Schedule::SchedulePayload.new('test_task', single, generate_payload)
    JPush::Schedule.create(payload)
  end

  def jpush
    JPush::JPushClientPusher.push(generate_payload)
  end

  private

  def generate_payload
    JPush::Push::PushPayload.new(
      platform:     'ios',
      audience:     generate_target_audience,
      notification: to_jpush_notification,
      message:      'hello'
    )
  end

  def to_jpush_notification
    notification = JPush::Push::Notification.new
    notification.set_ios(
      alert:            content,
      sound:            'sosumi.aiff',
      badge:            1,
      contentavailable: false,
      mutablecontent:   nil,
      category:         nil,
      extras: { data: @extra_info, type: self.class.notification_type }
    )
  end

  def generate_target_audience
    return @target if @target == 'all'
    @target = @target.map { |u| u.id.to_s } if @target.is_a?(Array)
    audience = JPush::Push::Audience.new
    audience.set_alias(@target)
  end

  class_methods do
    attr_reader :notification_type
    def notification_type(type)
      @notification_type = type if %w(broadcast notification).include?(type)
    end
  end
end
