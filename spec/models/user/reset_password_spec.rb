require 'rails_helper'

RSpec.describe User::ResetPassword, type: :model do
  describe '#save' do
    let(:user) { create(:user, :with_email, :with_password) }
    let(:verify_code) { VerifyCode.new(email: user.email, type: 'email').tap(&:save) }
    let(:reset_password) do
      code = Rails.cache.read("verify_code:#{verify_code.email}")
      User::ResetPassword.new(
        login_name: user.email,
        password: 'new_password',
        verify_code: code
      )
    end

    it 'should invalid without login_name or password or verify_code' do
      expect(reset_password.tap { |re| re.login_name = nil }).not_to be_valid
      expect(reset_password.tap { |re| re.password = nil }).not_to be_valid
      expect(reset_password.tap { |re| re.verify_code = nil }).not_to be_valid
    end

    it 'should invalid when user not exist' do
      reset_password.login_name = 'unexist@example.com'
      expect(reset_password).not_to be_valid
      expect(reset_password.errors.messages[:base]).to include('User not found')
    end

    it 'should invalid when verify_code not correct' do
      reset_password.verify_code = reset_password.verify_code.to_i.next.to_s
      expect(reset_password).not_to be_valid
      expect(reset_password.errors.messages[:base]).to include(I18n.t('errors.invalid_verify_code'))
    end

    it 'should valid' do
      expect(reset_password).to be_valid
    end

    it 'should not update user password when new password invalid' do
      reset_password.password = '123'
      expect(reset_password.save).to eq(false)
    end

    it 'should update user password' do
      reset_password.save
      expect(reset_password.user.authenticate(reset_password.password))
    end
  end
end
