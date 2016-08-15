require 'rails_helper'

RSpec.describe Users::SignupController, type: :controller do
  describe 'POST #create' do
    let(:basic_user) { attributes_for(:basic_user) }
    include_context 'prepare verify code' do
      let(:key) { basic_user[:email] }
    end

    before do
      basic_user[:verify_code] = @code
    end

    context 'verify code incorrect' do
      it 'should return error' do
        basic_user['verify_code'] = @code.to_i.next.to_s
        post :create, user: basic_user
        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body)['errors']).to include('验证码输入错误')
      end
    end

    context 'verify code correct' do
      it 'validate user params' do
        user = create(:basic_user)
        basic_user['email'] = user.email
        post :create, user: basic_user
        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body)['errors']).to include('Email已经被使用')
      end

      it 'verify code can not use twice' do
        post :create, user: basic_user
        basic_user['email'] = 'new@example.com'
        post :create, user: basic_user
        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body)['errors']).to include('验证码输入错误')
      end

      it 'return user when created' do
        post :create, user: basic_user
        expect(response).to be_success
        expect(JSON.parse(response.body)['user']['email']).to eq('u****@geekpark.net')
        expect(warden.user.email).to eq(basic_user[:email])
      end

      it 'return callback_url when created' do
        post :create, user: basic_user
        expect(response).to be_success
        expect(JSON.parse(response.body)['callback_url']).to eq(user_url)
      end
    end
  end
end
