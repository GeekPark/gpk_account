Rails.application.routes.draw do
  use_doorkeeper
  root 'sessions#new'

  # User sessions controller
  get 'login', to: 'sessions#new'
  post 'login', to: 'sessions#create'
  delete 'logout', to: 'sessions#destroy'

  # Omniauth
  match '/auth/:provider/callback', to: 'sessions#create', via: [:get, :post]
  # Captcha
  mount RuCaptcha::Engine => '/rucaptcha'
end
