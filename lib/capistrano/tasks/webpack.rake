namespace :deploy do
  desc 'Execute webpack compile And rsync to server'
  task :webpack, :force do |_, args|
    BUNDLE_DIR = 'public/static/'.freeze
    SERVER_ADDR = "#{roles(:web).first.user}@#{roles(:web).first.hostname}".freeze
    NEED_GENERATE = "ssh #{SERVER_ADDR} 'diff -r #{current_path}/frontend #{release_path}/frontend'".freeze

    run_locally do
      with rails_env: :production do
        # compare md5 if equal then next
        next if capture(NEED_GENERATE, raise_on_non_zero_exit: false).empty? && !args[:force]

        # generage webpack bundle file
        execute 'cd frontend && npm run g'

        # rsync bundled dir
        execute "rsync -avzr #{BUNDLE_DIR} #{SERVER_ADDR}:#{release_path}/#{BUNDLE_DIR}"

        execute 'cd frontend && npm run clean'
      end
    end

    invoke 'deploy:restart' if args[:force]
  end
end
