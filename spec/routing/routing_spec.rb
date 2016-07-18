require 'rails_helper'

RSpec.describe 'routing test', type: :routing do
  describe 'root_path' do
    it 'route to users edit' do
      expect(get: '/').to route_to('sessions#new')
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
    it 'route to users/signup#new via get' do
      expect(get: 'signup').to route_to('users/signup#new')
    end

    it 'route to users/signup#create via post' do
      expect(post: 'signup').to route_to('users/signup#create')
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
      expect(patch: 'settings/update_password').to route_to('settings#update_password')
    end
  end

  describe 'api' do
    it 'route to clients#captcha' do
      expect(get: 'api/v1/captcha').to route_to('api/v1/register#captcha')
    end

    it 'route to notifications#read' do
      expect(post: 'api/v1/notifications/1/read').to route_to(controller: 'api/v1/notifications',
                                                             action: 'read',
                                                             id: '1')
    end

    it 'route to notifications#read_all' do
      expect(post: 'api/v1/notifications/read_all').to route_to('api/v1/notifications#read_all')
    end
  end
end
