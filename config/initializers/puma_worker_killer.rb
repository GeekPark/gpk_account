PumaWorkerKiller.config do |config|
  config.ram           = 700 # mb
  config.frequency     = 5    # seconds
  config.percent_usage = 0.98
  config.rolling_restart_frequency = 12 * 3600 # 12 hours in seconds
  config.reaper_status_logs = true # setting this to false will not log lines like:
  # PumaWorkerKiller: Consuming 54.34765625 mb with master and 2 workers.

  config.pre_term = -> (worker) { puts "Worker #{worker.inspect} being killed" }
end
PumaWorkerKiller.start

