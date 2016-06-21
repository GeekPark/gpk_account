require 'rails_helper'

RSpec.describe Api::V1::UsersController, type: :controller do
  let(:user) { create(:full_user) }
  let(:public_token) { create(:public_access_token, resource_owner_id: user.id) }
  let(:write_token) { create(:write_access_token, resource_owner_id: user.id) }
  let(:admin_token) { create(:admin_access_token, resource_owner_id: user.id) }

  describe 'show' do
    it 'requires token to authorize' do
      get :show, format: :json
      expect(response.status).to eq(401)
    end

    it 'returns user info' do
      get :show, format: :json, access_token: public_token.token
      expect(response).to be_success
      expect(JSON.parse(response.body)['id']).to eq(user.id)
    end
  end

  describe 'extra_info' do
    it 'return queried attributes' do
      get :extra_info, access_token: admin_token.token, query: %w(email mobile)
      expect(response).to be_success
      json = JSON.parse(response.body)
      expect(json).to include('email', 'mobile', 'is_old')
      expect(json).not_to include('birthday')
      expect(json['email']).to eq user.email
    end

    it 'not return whitelited attribute' do
      get :extra_info, access_token: admin_token.token, query: %w(email password)
      expect(JSON.parse(response.body)).not_to include('password')
    end
  end

  describe 'update' do
    it 'requires token to have write access' do
      patch :update, format: :json
      expect(response.status).to eq(401)
      patch :update, format: :json, access_token: public_token.token
      expect(response.status).to eq(403)
    end

    it 'returns user' do
      patch :update, format: :json, access_token: write_token.token, nickname: 'testuser'
      expect(response).to be_success
      expect(JSON.parse(response.body)['nickname']).to eq('testuser')
    end
  end

  describe 'logout' do
    it 'revoked access token' do
      post :logout, access_token: public_token.token
      expect(response).to be_success
      expect(public_token.reload.accessible?).to eq false
    end

    it 'destory user device' do
      device = create(:device, user: user)
      post :logout, access_token: public_token.token, device_id: device.id
      expect(response).to be_success
      expect(user.devices.count).to eq 0
    end
  end

  describe 'third_part_login' do
    include_context 'prepare api signature'
    let(:origin_hash) do
      {
        client_id: application.uid,
        timestamp: Time.current.to_i
      }
    end

    it 'should return error when unsurpport provider is given' do
      post :third_part_login, origin_hash.merge(signature: calculate_signature, provider: 'test')
      expect(response).to have_http_status(400)
    end

    it 'should not create new authorization' do
      user = User.create_with_omniauth(mock_wechat_auth)
      allow_any_instance_of(Api::V1::UsersController).to receive(:wechat_auth).and_return(mock_wechat_auth)
      post :third_part_login, origin_hash.merge(signature: calculate_signature, provider: 'wechat')
      expect(response).to be_success
      expect(user.authorizations.where(uid: mock_wechat_auth['uid'],
                                       provider: mock_wechat_auth['provider']).count).to eq(1)
    end

    %w(weibo wechat).each do |provider|
      it "should return user's token" do
        allow_any_instance_of(Api::V1::UsersController).to receive(:"#{provider}_auth").and_return(mock_wechat_auth)
        post :third_part_login, origin_hash.merge(signature: calculate_signature, provider: provider)
        expect(response).to be_success
        expect(JSON.parse(response.body)).to include('access_token')
      end
    end

    describe 'wechat' do
      it 'should return error when code incorrect' do
        origin_hash[:code] = 123
        post :third_part_login, origin_hash.merge(signature: calculate_signature, provider: 'wechat')
        expect(response).to have_http_status(400)
      end
    end

    describe 'weibo' do
      it 'should return error when access_token incorrect' do
        origin_hash[:access_token] = 'incorrect_token'
        post :third_part_login, origin_hash.merge(signature: calculate_signature, provider: 'weibo')
        expect(response).to have_http_status(400)
      end
    end
  end

  describe 'PATCH#update_preference' do
    it 'should update user preference' do
      param_hash = {
        'receive_message' => false,
        'email' => {
          'enabled' => false,
          'subscriptions' => {
            'event' => 'unsubscribed',
            'report' => 'unsubscribed'
          }
        }
      }
      patch :update_preference, param_hash.merge(access_token: write_token.token)
      reload_user = User.find(user.id)
      expect(response).to be_success
      expect(reload_user.preference.receive_message).to eq false
    end
  end
end
