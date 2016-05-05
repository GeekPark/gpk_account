require 'rails_helper'

RSpec.describe SettingsController, type: :controller do
  let(:user) { create(:basic_user) }
  let(:full_user) { create(:full_user) }

  before do
    warden.set_user user
  end

  describe 'POST settings#verify_current_user with verify code' do
    before do
      @code = rand(100_000..999_999).to_s
      Rails.cache.write("verify_code:#{user[:email]}", @code)
    end

    after do
      Rails.cache.clear
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
  end

  describe 'PATCH settings#update_primary with new email' do
    before do
      @new_email = 'new@email.com'
      @code = rand(100_000..999_999).to_s
      Rails.cache.write("verify_code:#{@new_email}", @code)
    end

    after do
      Rails.cache.clear
    end

    it 'should return error if user not authenticate' do
      patch :update_primary, type: 'email', verify_code: @code, email: @new_email
      expect(response).to have_http_status(422)
      expect(JSON.parse(response.body)['errors']).to include('User not identified')
    end

    it 'should return error if verify_code invalid' do
      allow_any_instance_of(User).to receive(:identified?).and_return(true)
      patch :update_primary, type: 'email', verify_code: '111111', email: @new_email
      expect(response).to have_http_status(422)
      expect(JSON.parse(response.body)['errors']).to include('Verify code invalid')
    end

    it 'should return user if verify code correct' do
      allow_any_instance_of(User).to receive(:identified?).and_return(true)
      patch :update_primary, type: 'email', verify_code: @code, email: @new_email
      expect(JSON.parse(response.body)['email']).to eq('new@email.com')
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

    it 'should update password and return user if password and new password is valid' do
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
end
