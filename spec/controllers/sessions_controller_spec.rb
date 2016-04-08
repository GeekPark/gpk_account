require 'rails_helper'

RSpec.describe SessionsController, type: :controller do
  let(:user) { create(:full_user) }

  describe 'GET #new' do
    it 'returns http success' do
      get :new
      expect(response).to have_http_status(:success)
    end
  end

  describe 'POST #create' do
    it 'failed with wrong password' do
      post :create, loginname: user.email, password: '123456'
      expect(warden.user).to be_nil
    end

    it 'success with correct password' do
      post :create, loginname: user.email, password: 'password'
      expect(warden.user).to eq(user)
    end
  end

  describe 'DELETE #destroy' do
    it 'returns http success' do
      warden.set_user user
      expect(warden.user).to eq(user)
      get :destroy
      expect(warden.user).to be_nil
    end
  end
end
