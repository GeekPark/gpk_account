source 'https://gems.ruby-china.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 4.2'
# Use postgresql as the database for Active Record
gem 'pg', '~> 0.15'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'
# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem 'turbolinks'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'

# Use dotenv for envs
gem 'dotenv-rails', require: 'dotenv/rails-now'

# Use ActiveModel has_secure_password
gem 'bcrypt', '~> 3.1.7'

# Use warden for user authenticate
gem 'warden'

# Captcha
gem 'rucaptcha'

# Use Unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

# Omniauth
gem 'omniauth-geekpark', '0.2.0'

# API
gem 'active_model_serializers', '~> 0.9.5'
gem 'doorkeeper'

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
end

group :test do
  gem 'codeclimate-test-reporter', require: false
end
