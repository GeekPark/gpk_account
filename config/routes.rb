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
  get 'send_verify_code', to: 'users#send_verify_code'

  # User reset password
  get 'reset_password', to: 'users#new'
  post 'reset_password', to: 'users#reset_password'

  resource 'user', path: 'my', except: [:edit, :destroy] do
  end

  controller 'settings' do
    get 'settings/account', to: 'users#show'
    match 'settings/update_password', via: [:patch, :put]
    get 'settings/authorizations', to: 'users#show'
    delete 'auth/:provider/unbind', to: 'settings#unbind_auth'
  end

  namespace :api do
    namespace :v1 do
      resource 'user', only: [:show, :update]
    end
  end

  # Omniauth
  match '/auth/:provider/callback', to: 'sessions#create', via: [:get, :post]
  # Captcha
  mount RuCaptcha::Engine => '/rucaptcha'
  # City select
  mount ChinaCity::Engine => '/china_city'
end
