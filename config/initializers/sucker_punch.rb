require 'sucker_punch/async_syntax'

Rails.application.configure do
  config.active_job.queue_adapter = :sucker_punch
end
SuckerPunch.logger = Logger.new(File.join(Rails.root, 'log', 'notification.pem'))
