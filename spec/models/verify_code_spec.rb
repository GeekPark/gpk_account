require 'rails_helper'
RSpec.describe VerifyCode, type: :model do
  describe '#save' do
    before do
      @verify_code = VerifyCode.new(type: 'email', email: 'test@example.com')
    end

    it 'send code to user' do
      expect { @verify_code.save }.to change { ActionMailer::Base.deliveries.count }.by(1)
    end

    it 'write code to cache' do
      @verify_code.save
      expect(Rails.cache.read("verify_code:#{@verify_code.email}")).not_to be(nil)
    end
  end
end
