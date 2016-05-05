require 'rails_helper'

RSpec.describe SettingsController, type: :controller do
  let(:user) { create(:basic_user) }
  let(:full_user) { create(:full_user) }

  before do
    warden.set_user user
  end

  describe 'POST settings#verify_current_user with verify code' do
    include_context 'prepare verify code' do
      let(:key) { user.email }
    end

    it 'should return error if verify code invalid' do
      post :verify_current_user, type: 'email', verify_code: '111111'
      expect(response).to have_http_status(422)
      expect(JSON.parse(response.body)['errors']).to include('Verify code invalid')
    end

    it 'should set user authenticate if verify code correct' do
      post :verify_current_user, type: 'email', verify_code: @code
      expect(response).to be_success
      token = Rails.cache.fetch("identify_token:#{user.id}")
      expect(token).not_to eq(nil)
      expect(cookies['identify_token']).to eq(token)
    end

    it 'should set user is_old false if user is_old is true' do
      user.update(is_old: true)
      post :verify_current_user, type: 'email', verify_code: @code
      expect(response).to be_success
      expect(user.is_old).to eq(false)
    end
  end

  describe 'PATCH settings#update_primary with new email' do
    include_context 'prepare verify code'

    it 'should return error if user not authenticate' do
      patch :update_primary, type: 'email', verify_code: @code, email: key
      expect(response).to have_http_status(422)
      expect(JSON.parse(response.body)['errors']).to include('User not identified')
    end

    it 'should return error if verify_code invalid' do
      allow_any_instance_of(User).to receive(:identified?).and_return(true)
      patch :update_primary, type: 'email', verify_code: '111111', email: key
      expect(response).to have_http_status(422)
      expect(JSON.parse(response.body)['errors']).to include('Verify code invalid')
    end

    it 'should return user if verify code correct' do
      allow_any_instance_of(User).to receive(:identified?).and_return(true)
      patch :update_primary, type: 'email', verify_code: @code, email: key
      expect(JSON.parse(response.body)['email']).to eq('new@email.com')
    end

    it 'should return user if user is_old and verify_code correct' do
      user.update(is_old: true)
      patch :update_primary, type: 'email', verify_code: @code, email: key
      expect(JSON.parse(response.body)['email']).to eq(key)
    end

    it 'should return user if sns user' do
      user.update(email: nil, mobile: nil)
      patch :update_primary, type: 'email', email: key, verify_code: @code, password: 'new_password'
      expect(JSON.parse(response.body)['email']).to eq(key)
      expect(user.authenticate('new_password')).to eq(user)
    end
  end

  describe 'PATCH settings#update_primary with new mobile' do
    include_context 'prepare verify code' do
      let(:key) { '13000000000' }
    end

    it 'should return error if user is_old and set mobile' do
      user.update(is_old: true)
      patch :update_primary, type: 'mobile', verify_code: @code, mobile: key
      expect(JSON.parse(response.body)['errors']).to include('User not identified')
    end
  end

  describe 'PATCH settings#update_password with new password' do
    it 'should return error if password is invalid' do
      patch :update_password, password: '111111', new_password: '222222'
      expect(JSON.parse(response.body)['errors']).to include('Password invalid')
    end

    it 'should return error if new password is invalid' do
      patch :update_password, password: user.password, new_password: '12345'
      expect(JSON.parse(response.body)['errors']).to include('Password is too short (minimum is 6 characters)')
    end

    it 'should update password and return user' do
      patch :update_password, password: user.password, new_password: '123456'
      expect(JSON.parse(response.body)['email']).to eq(user.email)
      expect(user.authenticate('123456')).to eq(user)
    end
  end

  describe 'DELETE settings#unbind_auth' do
    before do
      warden.set_user full_user
    end

    it 'should delete authorization' do
      delete :unbind_auth, provider: 'wechat'
      expect(response).to be_success
      expect(JSON.parse(response.body)['email']).to eq(full_user.email)
    end

    it 'should return error if Authorization not found' do
      delete :unbind_auth, provider: 'wechat'
      delete :unbind_auth, provider: 'wechat'
      expect(JSON.parse(response.body)['errors']).to include('Authorization not found')
    end
  end

  describe 'POST settings#identified' do
    it 'should return false' do
      post :identified
      expect(JSON.parse(response.body)['identified']).to eq(false)
    end

    it 'should return false' do
      token = user.generate_identify_token
      cookies['identify_code'] = token
      post :identified
      expect(JSON.parse(response.body)['identified']).to eq(true)
    end
  end
end
