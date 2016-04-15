Rails.application.routes.draw do
  # User sessions controller
  get 'login', to: 'sessions#new'
  post 'login', to: 'sessions#create'
  delete 'logout', to: 'sessions#destroy'

  # Omniauth
  match '/auth/:provider/callback', to: 'sessions#create', via: [:get, :post]
end
