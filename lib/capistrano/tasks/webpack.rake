namespace :deploy do
  desc 'Execute webpack compile And rsync to server'
  task :webpack, :force do |_, args|
    BUNDLE_DIR = 'public/static'.freeze
    DIFF_COMMAND = "diff -Nr #{current_path}/frontend #{release_path}/frontend".freeze
    need_generate = false

    # compare md5 if equal then next
    on roles(:app) do
      need_generate = !capture(DIFF_COMMAND, raise_on_non_zero_exit: false).empty? || args[:force]
    end

    run_locally do
      with rails_env: :production do
        next unless need_generate

        # generage webpack bundle file
        execute 'cd frontend && npm i && npm run g'

        on roles(:app) do
          upload! "#{BUNDLE_DIR}/", "#{shared_path}/#{BUNDLE_DIR.split('/').first}", recursive: true
        end

        execute 'cd frontend && npm run clean'
      end
    end

    invoke 'deploy:restart' if args[:force]
  end
end
