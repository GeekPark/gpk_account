require 'rails_helper'

RSpec.describe 'routing test', type: :routing do
  describe 'root_path' do
    it 'route to users edit' do
      expect(get: '/').to route_to('users#show')
    end
  end

  describe 'login' do
    it 'route to sessions#new via get' do
      expect(get: 'login').to route_to('sessions#new')
    end
    it 'route to sessions#create via post' do
      expect(post: 'login').to route_to('sessions#create')
    end
  end

  describe 'logout' do
    it 'route to sessions#destroy via delete' do
      expect(delete: 'logout').to route_to('sessions#destroy')
    end
  end

  describe 'signup' do
    it 'route to users#new via get' do
      expect(get: 'signup').to route_to('users#new')
    end

    it 'route to users#create via post' do
      expect(post: 'signup').to route_to('users#create')
    end
  end

  describe 'my' do
    it 'route to users#edit when get /' do
      expect(get: 'my').to route_to('users#show')
    end

    it 'route to users#update when put or patch /' do
      expect(put: 'my').to route_to('users#update')
      expect(patch: 'my').to route_to('users#update')
    end
  end

  describe 'settings' do
    it 'route to users#show when get /settings' do
      expect(get: 'settings').to route_to('users#show')
    end

    it 'route to settings#update_password when put or patch /settings/update_password' do
      expect(put: 'settings/update_password').to route_to('settings#update_password')
      expect(patch: 'settings/update_password').to route_to('settings#update_password')
    end
  end
end
