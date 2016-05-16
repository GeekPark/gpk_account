require 'rails_helper'

RSpec.describe Api::V1::UsersController, type: :controller do
  let(:user) { create(:full_user) }
  let(:public_token) { create(:public_access_token, resource_owner_id: user.id) }
  let(:write_token) { create(:write_access_token, resource_owner_id: user.id) }

  describe 'show' do
    it 'requires token to authorize' do
      get :show, format: :json
      expect(response.status).to eq(401)
    end

    it 'returns user info' do
      get :show, format: :json, access_token: write_token.token
      expect(response).to be_success
      expect(JSON.parse(response.body)['id']).to eq(user.id)
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

  describe 'third_part_login' do
    include_context 'prepare api signature'
    describe 'wechat' do
      let(:origin_hash) do
        {
          client_id: application.uid,
          timestamp: Time.current.to_i,
          code: 123
        }
      end

      it 'should return error when code incorrect' do
        post :third_part_login, origin_hash.merge(signature: calculate_signature, provider: 'wechat')
        expect(response).to have_http_status(400)
      end

      it "should return user's token" do
        allow_any_instance_of(Api::V1::UsersController).to receive(:wechat_auth).and_return(mock_wechat_auth)
        post :third_part_login, origin_hash.merge(signature: calculate_signature, provider: 'wechat')
        expect(response).to be_success
        expect(JSON.parse(response.body)).to include('access_token')
      end
    end
  end
end
