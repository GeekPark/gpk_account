require 'rails_helper'

RSpec.describe SettingsController, type: :controller do
  let(:user) { create(:basic_user) }

  before do
    warden.set_user user
  end

  describe 'PATCH settings#update with new password' do
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
      expect(JSON.parse(response.body)['user']['email']).to eq(user.email)
      expect(user.authenticate('123456')).to eq(user)
    end
  end
end
