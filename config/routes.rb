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

  resource 'user', path: 'my', except: [:edit, :destroy] do
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
end
