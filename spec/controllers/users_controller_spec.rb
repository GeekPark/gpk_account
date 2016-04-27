require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  let(:user) { create(:basic_user) }

  describe 'GET #welcome' do
    it_behaves_like 'redirect_to login_url' do
      let(:subject) { get :welcome }
    end

    it 'should assgins user a json' do
      warden.set_user(user)
      get :welcome
      expect(JSON.parse(assigns(:user))['id']).to eq(user.id)
    end
  end

  describe 'GET #show' do
    context 'user not login' do
      it_behaves_like 'return 401 without login' do
        let(:subject) { get :show, format: :json }
      end

      it_behaves_like 'redirect_to login_url' do
        let(:subject) { get :show }
      end
    end

    context 'user logged in' do
      before { warden.set_user(user) }

      it 'shoud return user info after user login' do
        get :show, format: :json
        expect(response).to be_success
        expect(JSON.parse(response.body)['email']).to eq(user.email)
      end

      it 'should success' do
        get :show, format: :html
        expect(response).to be_success
        expect(response).to render_template(:show)
        expect(JSON.parse(assigns(:user))['id']).to eq(user.id)
      end
    end
  end

  describe 'PATCH #update' do
    let(:user_attr) { attributes_for(:user, :with_nickname) }

    context 'user not login' do
      it_behaves_like 'return 401 without login' do
        let(:subject) { patch :update, user: user_attr, format: :json }
      end
    end

    context 'user logged in' do
      before { warden.set_user(user) }

      it 'should success and return user info' do
        patch :update, user: user_attr, format: :json
        expect(response).to be_success
        expect(JSON.parse(response.body)['nickname']).to eq(user_attr[:nickname])
      end
    end
  end

  describe 'POST #create' do
    before do
      @basic_user = attributes_for(:basic_user)
      email = @basic_user[:email]
      allow_any_instance_of(UsersController).to receive(:verify_rucaptcha?).and_return(true)
      get 'send_verify_code', user: { email: email }
      @code = Rails.cache.fetch "verify_code:#{email}"
    end

    after do
      Rails.cache.clear
    end

    context 'verify code incorrect' do
      it 'should return error' do
        post :create, user: @basic_user, verify_code: '1111111'
        expect(response).to have_http_status(:not_acceptable)
        expect(JSON.parse(response.body)['errors']).to include('Verify code invalid')
      end
    end

    context 'verify code correct' do
      it 'validate user params' do
        User.create(@basic_user)
        post :create, user: @basic_user, verify_code: @code
        expect(response).to have_http_status(:not_acceptable)
        expect(JSON.parse(response.body)['errors']).to include('Email has already been taken')
      end

      it 'return user when created' do
        post :create, user: @basic_user, verify_code: @code
        expect(response).to be_success
        expect(JSON.parse(response.body)['user']['email']).to eq(@basic_user[:email])
        expect(warden.user.email).to eq(@basic_user[:email])
      end

      it 'return callback_url when created' do
        post :create, user: @basic_user, verify_code: @code
        expect(response).to be_success
        expect(JSON.parse(response.body)['callback_url']).to eq(welcome_url)
      end
    end
  end

  describe 'GET #check_exist' do
    it 'should return false user not exist' do
      get 'check_exist', user: attributes_for(:user, :with_email)
      expect(response.body).to eq({ exist: false }.to_json)
    end

    it 'should return true user exist' do
      get 'check_exist', user: { email: user.email }
      expect(response.body).to eq({ exist: true }.to_json)
    end
  end

  describe 'GET #send_verify_code' do
    context 'captcha incorrect' do
      it 'should return error' do
        get 'send_verify_code', user: attributes_for(:user, :with_email)
        expect(response).to have_http_status(:not_acceptable)
        expect(JSON.parse(response.body)['errors']).to include('Captcha invalid!')
      end
    end

    context 'captcha correct' do
      before do
        allow_any_instance_of(UsersController).to receive(:verify_rucaptcha?).and_return(true)
      end

      it 'should return error when user exist' do
        get 'send_verify_code', user: { email: user.email }
        expect(response).to have_http_status(:not_acceptable)
        expect(JSON.parse(response.body)['errors']).to include('Email has already been taken')
      end

      it 'should return success after send' do
        get 'send_verify_code', user: attributes_for(:user, :with_email)
        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body)['success']).to include('Sended')
      end
    end
  end
end
