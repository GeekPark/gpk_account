Rails.application.routes.draw do
  root 'users#edit'

  # User sessions controller
  get 'login', to: 'sessions#new'
  post 'login', to: 'sessions#create'
  delete 'logout', to: 'sessions#destroy'

  # User signup
  get 'signup', to: 'users#new'
  post 'signup', to: 'users#create'

  resource 'user', path: 'my', except: [:edit, :destroy] do
  end

  namespace :api do
    resource 'user', only: [:show, :update]
  end

  # Omniauth
  match '/auth/:provider/callback', to: 'sessions#create', via: [:get, :post]
  # Captcha
  mount RuCaptcha::Engine => '/rucaptcha'
end
