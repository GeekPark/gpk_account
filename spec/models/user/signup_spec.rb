require 'rails_helper'

RSpec.describe User::Signup, type: :model do
  describe '#save' do
    let(:signup) { User::Signup.new }

    it 'should invalid without email and mobile' do
      expect(signup).not_to be_valid
    end

    let(:signup) { User::Signup.new(email: 'test@example.com', password: '123456') }
    let(:verify_code) { VerifyCode.new(email: signup.email, type: 'email').tap(&:save) }

    it 'should invalid when verify_code not correct' do
      signup.verify_code = (Rails.cache.read("verify_code:#{verify_code.email}").to_i + 1).to_s
      expect(signup).not_to be_valid
    end

    it 'should invalid when password is too short' do
      signup.verify_code = Rails.cache.read("verify_code:#{verify_code.email}")
      signup.password = '123'
      expect(signup).not_to be_valid
    end

    it 'should valid when verify_code correct' do
      signup.verify_code = Rails.cache.read("verify_code:#{verify_code.email}")
      expect(signup).to be_valid
    end
  end
end
