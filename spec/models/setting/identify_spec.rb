require 'rails_helper'

RSpec.describe Setting::Identify, type: :model do
  describe '#save' do
    let(:user) { create(:basic_user) }
    let(:verify_code) { VerifyCode.new(email: user.email, type: 'email').tap(&:save) }
    let(:identify) { Setting::Identify.new(type: 'email', user_id: user.id, verify_code: verify_code.code) }

    it 'should invalid without type verify_code user_id' do
      expect(identify.tap { |i| i.verify_code = nil }).not_to be_valid
      expect(identify.tap { |i| i.user_id = nil }).not_to be_valid
      expect(identify.tap { |i| i.type = nil }).not_to be_valid
    end

    it 'should invalid when user not found' do
      identify.user_id = '111'
      expect(identify).not_to be_valid
      expect(identify.errors.messages[:base]).to include('User not found')
    end

    it 'should invalid when verify_code not correct' do
      identify.verify_code = identify.verify_code.to_i.next.to_s
      expect(identify).not_to be_valid
      expect(identify.errors.messages[:base]).to include(I18n.t('errors.invalid_verify_code'))
    end

    it 'should valid' do
      expect(identify).to be_valid
    end
  end
end
