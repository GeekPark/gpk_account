require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  let(:user) { create(:basic_user) }

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
        expect(JSON.parse(response.body)['user']['email']).to eq('u****@geekpark.net')
      end

      it 'should return user authorizations' do
        create(:weibo_authorization, user_id: user.id)
        get :show, format: :json
        expect(response).to be_success
        expect(JSON.parse(response.body)['user']['authorizations'].first['provider']).to eq('weibo')
      end

      it 'should success' do
        get :show, format: :html
        expect(response).to be_success
        expect(response).to render_template(:show)
        expect(assigns(:data)[:user].id).to eq(user.id)
      end
    end
  end

  describe 'PATCH #update' do
    let(:user_attr) { attributes_for(:user) }

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

      it 'can update avatar' do
        patch :update, user: attributes_for(:user, :with_avatar), format: :json
        expect(JSON.parse(response.body)['avatar_url']).not_to be_nil
      end
    end
  end

  describe 'POST #create' do
    let(:basic_user) { attributes_for(:basic_user) }
    include_context 'prepare verify code' do
      let(:key) { basic_user[:email] }
    end

    context 'verify code incorrect' do
      it 'should return error' do
        post :create, user: basic_user, verify_code: '1111111'
        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body)['errors']).to include('验证码输入错误')
      end
    end

    context 'verify code correct' do
      it 'validate user params' do
        User.create(basic_user)
        post :create, user: basic_user, verify_code: @code
        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body)['errors']).to include('Email已经被使用')
      end

      it 'verify code can not use twice' do
        post :create, user: basic_user, verify_code: '1111111'
        post :create, user: basic_user, verify_code: @code
        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body)['errors']).to include('验证码输入错误')
      end

      it 'return user when created' do
        post :create, user: basic_user, verify_code: @code
        expect(response).to be_success
        expect(JSON.parse(response.body)['user']['email']).to eq('u****@geekpark.net')
        expect(warden.user.email).to eq(basic_user[:email])
      end

      it 'return callback_url when created' do
        post :create, user: basic_user, verify_code: @code
        expect(response).to be_success
        expect(JSON.parse(response.body)['callback_url']).to eq(user_url)
      end
    end
  end

  describe 'GET #reset_password' do
    include_context 'prepare verify code' do
      let(:key) { user.email }
    end

    it 'verify code invalid' do
      post :reset_password, user: { email: key, password: 'new_password' }, verify_code: '111111'
      expect(JSON.parse(response.body)['errors']).to include('验证码输入错误')
    end

    it 'return error when user not found' do
      post :reset_password, user: { email: 'ex@am.ple' }, verify_code: @code
      expect(JSON.parse(response.body)['errors']).to include('User not found')
    end

    it 'return user and callback when success' do
      post :reset_password, user: { email: key, password: 'new_password' }, verify_code: @code
      expect(JSON.parse(response.body)['user']['email']).to eq(user.email)
      expect(JSON.parse(response.body)['callback_url']).to eq(user_url)
    end
  end

  describe 'GET #check_exist' do
    let(:subject) { JSON.parse(response.body) }
    let(:user_with_avatar) { create(:basic_user, :with_avatar) }

    it 'should return false user not exist' do
      get 'check_exist', user: attributes_for(:user, :with_email)
      expect(subject['exist']).to eq(false)
    end

    it 'should return true user exist' do
      get 'check_exist', user: { email: user_with_avatar.email }
      expect(subject['exist']).to eq(true)
      expect(subject['avatar_url']).to eq(user_with_avatar.avatar_url)
    end
  end

  describe 'POST #send_verify_code' do
    let(:user) { create(:user, :with_email, :with_mobile) }

    it_behaves_like 'send verify code' do
      let(:subject) { post 'send_verify_code', type: 'mobile', mobile: user.mobile }
    end

    it_behaves_like 'send verify code' do
      let(:subject) { post 'send_verify_code', type: 'email', email: user.email }
    end
  end
end
