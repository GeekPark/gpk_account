require 'rails_helper'

RSpec.describe Users::ResetPasswordController, type: :controller do
  let(:user) { create(:basic_user) }

  describe 'GET #reset_password' do
    include_context 'prepare verify code' do
      let(:key) { user.email }
    end

    it 'verify code invalid' do
      post :create, user: { email: key, password: 'new_password', verify_code: @code.to_i.next.to_s }
      expect(JSON.parse(response.body)['errors']).to include('验证码输入错误')
    end

    it 'return error when user not found' do
      post :create, user: { email: 'ex@am.ple', verify_code: @code }
      expect(JSON.parse(response.body)['errors']).to include('User not found')
    end

    it 'return user and callback when success' do
      post :create, user: { email: key, password: 'new_password', verify_code: @code }
      expect(JSON.parse(response.body)['user']['email']).to eq(user.email)
      expect(JSON.parse(response.body)['callback_url']).to eq(user_url)
    end
  end
end
