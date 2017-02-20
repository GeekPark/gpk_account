module JPush
  JPushClient = JPush::Client.new(ENV['JPushClientKey'], ENV['JPushClientSecret'])
  JPushClientPusher = JPushClient.pusher
end
