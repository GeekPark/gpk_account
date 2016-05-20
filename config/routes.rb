Rails.application.routes.draw do
  root 'users#show'

  use_doorkeeper scope: 'oauth2'
  # User sessions controller
  get 'login', to: 'sessions#new'
  post 'login', to: 'sessions#create'
  delete 'logout', to: 'sessions#destroy'

  # User signup
  get 'signup', to: 'users#new'
  post 'signup', to: 'users#create'
  get 'check_exist', to: 'users#check_exist'

  post 'send_verify_code', to: 'users#send_verify_code'

  # User reset password
  get 'reset_password', to: 'users#new'
  post 'reset_password', to: 'users#reset_password'

  resource 'user', path: 'my', except: [:edit, :destroy] do
  end

  # User settings
  get 'settings', to: 'users#show'
  delete 'auth/:provider/unbind', to: 'settings#unbind_auth'
  namespace :settings do
    post 'send_verify_code'
    post 'verify_current_user'
    patch 'update_primary'
    patch 'update_password'
    post 'identified'
    get 'two_factor_qr'
    post 'two_factor'
  end

  namespace :api do
    namespace :v1 do
      # Register
      get 'captcha', to: 'register#captcha'
      post 'send_verify_code', to: 'register#send_verify_code'
      post 'register', to: 'register#register'

      resource 'user', only: [:show, :update] do
        post ':provider/login', action: 'third_part_login'
        get 'extra_info'
      end
    end
  end

  # Omniauth
  match '/auth/:provider/callback', to: 'sessions#create', via: [:get, :post]
  # Captcha
  mount RuCaptcha::Engine => '/rucaptcha'
  # City select
  mount ChinaCity::Engine => '/china_city'
end
