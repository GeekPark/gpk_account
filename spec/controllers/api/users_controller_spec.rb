require 'rails_helper'

RSpec.describe Api::UsersController, type: :controller do
  let(:user) { create(:full_user) }
  let(:public_token) { create(:public_access_token, resource_owner_id: user.id) }
  let(:write_token) { create(:write_access_token, resource_owner_id: user.id) }

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
end
