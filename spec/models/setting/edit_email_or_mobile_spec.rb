require 'rails_helper'

RSpec.describe Setting::EditEmailOrMobile, type: :model do
  describe '#save' do
    let(:user) { create(:user) }

    let(:verify_code) { VerifyCode.new(email: 'new@example.com', type: 'email').tap(&:save) }
    let(:eeom) { Setting::EditEmailOrMobile.find(user.id) }
    before do
      eeom.type = 'email'
      eeom.verify_code = verify_code.code
      eeom.email = 'new@example.com'
    end

    it 'should invalid when type or verify code is nil' do
      expect(eeom.dup.tap { |e| e.type = nil }).not_to be_valid
      expect(eeom.dup.tap { |e| e.verify_code = nil }).not_to be_valid
    end

    it 'should invalid when verify code incorrect' do
      eeom.verify_code = eeom.verify_code.to_i.next.to_s
      expect(eeom).not_to be_valid
    end

    it 'should valid' do
      expect(eeom).to be_valid
    end

    it 'should update email when valid' do
      eeom.save
      expect(User.find(eeom.id).email).to eq(eeom.email)
    end
  end
end
