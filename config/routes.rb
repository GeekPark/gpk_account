Rails.application.routes.draw do
  root 'sessions#new'

  use_doorkeeper scope: 'oauth2'
  # User sessions controller
  get 'login', to: 'sessions#new'
  post 'login', to: 'sessions#create'
  match 'logout', to: 'sessions#destroy', via: [:get, :delete]
  get 'two_factor_verify', to: 'sessions#two_factor_verify'

  # User signup
  get 'signup', to: 'users/signup#new'
  post 'signup', to: 'users/signup#create'
  get 'check_exist', to: 'users#check_exist'

  post 'send_verify_code', to: 'verify_codes#create'

  # User reset password
  get 'reset_password', to: 'users/reset_password#new'
  post 'reset_password', to: 'users/reset_password#create'

  resource 'user', path: 'my', except: [:edit, :destroy] do
    get 'access_key'
  end

  # User settings
  get 'settings', to: 'users#show'
  delete 'auth/:provider/unbind', to: 'settings#unbind_auth'
  namespace :settings do
    post 'verify_current_user', to: 'identifies#create'
    patch 'update_primary', to: 'edit_email_or_mobile#update'
    patch 'update_password'
    get 'identified'
    get 'two_factor_qr'
    post 'two_factor'
    patch 'update_preference'
  end

  namespace :admin do
    root 'broadcasts#index'
    resources 'broadcasts', only: [:index, :new, :create]

    resources :users, only: [:index, :show, :update] do
      get :brief, action: 'show_user_breif'
      post :ban, action: 'ban'
      post :unban, action: 'unban'
      collection do
        get :yesterday, action: 'yesterday'
      end
    end
  end

  namespace :api do
    namespace :v1 do
      # Register
      get 'captcha', to: 'register#captcha'
      get 'check_verify_code', to: 'register#check_verify_code'
      post 'send_verify_code', to: 'register#send_verify_code'
      post 'register', to: 'register#register'
      post 'reset_password', to: 'register#reset_password'

      resource 'user', only: [:show, :update] do
        post ':provider/login', action: 'third_part_login'
        get 'recommends'
        get 'extra_info'
        get 'count'
        post 'logout'
        patch 'update_preference'
      end

      resources :users, only: [] do
        get 'state', action: 'show_state'
        collection do
          get 'possible_roles', action: 'possible_roles'
          get 'brief', action: 'show_brief'
        end
      end

      resources 'broadcasts', only: [:create, :index] do
        patch 'read_all', on: :collection
      end

      resource 'device', only: :create

      resources 'notifications', only: [:index, :create] do
        post 'read', on: :member
        post 'read_all', on: :collection
        get 'all', on: :collection
        post 'create_notification', on: :collection
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
