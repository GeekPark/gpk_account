Rails.application.routes.draw do
  root 'sessions#new'

  use_doorkeeper scope: 'oauth2'
  # User sessions controller
  get 'login', to: 'sessions#new'
  post 'login', to: 'sessions#create'
  match 'logout', to: 'sessions#destroy', via: [:get, :delete]
  get 'two_factor_verify', to: 'sessions#two_factor_verify'

  # User signup
  get 'signup', to: 'users#new'
  post 'signup', to: 'users#create'
  get 'check_exist', to: 'users#check_exist'

  post 'send_verify_code', to: 'users#send_verify_code'

  # User reset password
  get 'reset_password', to: 'users#new'
  post 'reset_password', to: 'users#reset_password'

  resource 'user', path: 'my', except: [:edit, :destroy]

  # User settings
  get 'settings', to: 'users#show'
  delete 'auth/:provider/unbind', to: 'settings#unbind_auth'
  namespace :settings do
    post 'send_verify_code'
    post 'verify_current_user'
    patch 'update_primary'
    patch 'update_password'
    get 'identified'
    get 'two_factor_qr'
    post 'two_factor'
    patch 'update_preference'
  end

  namespace :api do
    namespace :v1 do
      # Register
      get 'captcha', to: 'register#captcha'
      post 'send_verify_code', to: 'register#send_verify_code'
      post 'register', to: 'register#register'

      resource 'user', only: [:show, :update] do
        post ':provider/login', action: 'third_part_login'
        get 'recommends'
        get 'extra_info'
        post 'logout'
        patch 'update_preference'
      end

      resource 'device', only: :create
      resources 'notifications', only: [:index, :create] do
        post 'read', on: :member
        post 'read_all', on: :collection
      end

      resources 'direct_messages', only: [:index, :create] do
        get 'detail', on: :collection
        patch 'read_all', on: :collection
      end
    end
  end

  # Omniauth
  get '/auth/:provider/callback', to: 'sessions#create'
  # Captcha
  mount RuCaptcha::Engine => '/rucaptcha'
  # City select
  mount ChinaCity::Engine => '/china_city'
end
