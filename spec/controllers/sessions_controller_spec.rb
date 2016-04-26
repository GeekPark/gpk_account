require 'rails_helper'

RSpec.describe SessionsController, type: :controller do
  let(:user) { create(:full_user) }

  describe 'GET #new' do
    it 'returns http success' do
      get :new
      expect(response).to have_http_status(:success)
    end

    it 'redirect to root_url user already login' do
      warden.set_user(user)
      get :new
      expect(response).to redirect_to(root_url)
    end
  end

  describe 'POST #create' do
    context 'user login with password' do
      it 'failed with wrong password' do
        post :create, login_name: user.email, password: '123456'
        expect(warden.user).to be_nil
      end

      it 'failed no warden strategies fetched' do
        post :create
        expect(warden.user).to be_nil
      end

      it 'success with correct password' do
        post :create, login_name: user.email, password: 'password'
        expect(warden.user).to eq(user)
        expect(response).to redirect_to(root_url)
      end
    end

    context 'user login with omniauth' do
      before { request.env['omniauth.auth'] = mock_wechat_auth }

      it 'should successfully create a user when user first login' do
        expect { post :create, provider: :wechat }.to change { User.count }.by(1)
      end

      it 'should login without create user when user exsit' do
        user = User.create_with_omniauth(mock_wechat_auth)
        expect { post :create, provider: :wechat }.to change { User.count }.by(0)

        expect(warden.user).to eq(user)
      end
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
