source 'https://gems.ruby-china.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 4.2.7', '>= 4.2.7.1'
# Use postgresql as the database for Active Record
gem 'pg', '~> 0.15'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0', '>= 5.0.6'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'
# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem 'turbolinks'

# Use dotenv for envs
gem 'dotenv-rails', require: 'dotenv/rails-now'

# Use ActiveModel has_secure_password
gem 'bcrypt', '~> 3.1.7'

# Use warden for user authenticate
gem 'warden'
# 2 factor
gem 'active_model_otp'
gem 'rqrcode'

# Custom counter cache
gem 'counter_culture'
# Captcha
gem 'rucaptcha'

gem 'carrierwave'
gem 'mini_magick'

# SMS
gem 'china_sms'

# Apple push notification
gem 'jpush'

# Asynchronous processing
gem 'sucker_punch'

# Use pums as the app server
gem 'puma'

# Mailchimp api
gem 'gibbon'

# Omniauth
# gem 'omniauth-geekpark', '1.0.6'
gem 'omniauth-geekpark', git: 'https://github.com/GeekPark/omniauth-geekpark.git'

# API
gem 'rails-api'
gem 'active_model_serializers', '~> 0.9.5'
gem 'doorkeeper', '>= 4.2.0'
gem 'china_city'

# Pagination
gem 'kaminari'
gem 'api-pagination'

# Rack middleware for blocking & throttling abusive requests
gem 'rack-attack'

# Allow Cors
gem 'rack-cors', require: 'rack/cors'

# Make Ruby object like ActiveRecord
gem 'active_type'

# Redis for account key exchange
gem 'redis'

# Error reporting & analysis
gem 'rollbar'

# set default respond to
gem 'responders', '~> 2.0'

group :development, :test do
  # Call 'binding.pry' anywhere in the code to stop execution and get a debugger console
  gem 'pry-byebug'
  # Test
  gem 'rspec-rails', '~> 3.0'
  gem 'factory_girl_rails'

  # Guard
  gem 'guard-rspec', require: false
  gem 'terminal-notifier-guard' # This need terminal-notifier, brew install it
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'

  # Use pry for debug and replace the default rails console
  gem 'pry-rails'
  gem 'awesome_print'

  # For rails pannel
  gem 'meta_request'

  gem 'quiet_assets'

  gem 'rubocop', require: false
  gem 'overcommit', require: false

  # for email preview
  gem 'letter_opener'

  # For deployment
  gem 'capistrano',         require: false
  gem 'capistrano-rbenv',   require: false
  gem 'capistrano-rails',   require: false
  gem 'capistrano-bundler', require: false
  gem 'capistrano3-puma',   require: false

  gem 'bullet'
end

group :test do
  gem 'codeclimate-test-reporter', require: false
  # This fix after commit not run in rails 4 no needs in Rails 5
  gem 'test_after_commit'
end

group :production do
  # Cache store
  gem 'redis-rails'
  gem 'rack-utf8_sanitizer'
  gem 'exception_notification'
  gem 'oneapm_rpm'
end
