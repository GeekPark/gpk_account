require 'rails_helper'

RSpec.describe Authorization, type: :model do
  describe 'validation' do
    let(:user) { create(:user, :without_validation, :with_wechat_authorization) }

    it 'only one authorization each provider per user' do
      expect(user.authorizations.build(attributes_for(:wechat_authorization))).not_to be_valid
      expect(user.authorizations.build(attributes_for(:weibo_authorization))).to be_valid
    end

    it 'can not destroy the last authorization if user dont have email or mobile' do
      expect(user.authorizations.first.destroy).to be_falsy
    end
  end
end
