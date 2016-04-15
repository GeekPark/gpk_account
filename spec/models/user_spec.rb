require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'user validation' do
    context 'on official create' do
      it 'should invalid without email or mobile' do
        expect(build(:user)).not_to be_valid
      end

      it 'should valid with email or mobile' do
        expect(create(:user, :with_email)).to be_valid
        expect(create(:user, :with_mobile)).to be_valid
      end
    end

    context 'on update' do
      it 'could not set password without email and mobile' do
        user = create(:user, :without_validation, :with_wechat_authorization)
        user.password = 'password'
        user.valid?
        expect(user.authorizations.count).to eq 1
        expect(user.errors[:password]).to include('please set the email or mobile first')
      end
    end
  end

  describe 'create_with_omniauth' do
    let!(:user) { User.create_with_omniauth mock_wechat_auth }

    it 'should create a user' do
      expect(User.count).to eq(1)
      expect(user).to be_valid
      expect(user.authorizations.count).to eq(1)
      expect(user.nickname).to eq('mockuser')
    end

    it 'should fail to create user when authorization validation failed' do
      expect(User.create_with_omniauth(mock_wechat_auth)).to be_nil
      expect(User.count).to eq(1)
    end
  end
end
