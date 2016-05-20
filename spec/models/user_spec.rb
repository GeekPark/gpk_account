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
        user = create(:sns_user)
        user.password = 'password'
        user.valid?
        expect(user.authorizations.count).to eq 1
        expect(user.errors[:password]).to include('please set the email or mobile first')
      end
    end
  end

  describe 'user#authencitate' do
    it 'should failed when password is blank' do
      user = create(:user, :with_email)
      expect(user.authenticate('')).to be_nil
    end

    it 'should success' do
      user = create(:basic_user)
      expect(user.authenticate('password')).to eq(user)
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

  describe 'is_old' do
    let(:user) { create(:old_user) }
    it 'should change is_old to false after update email' do
      user.update(email: 'testname@lsjdf.com')
      expect(user.is_old?).to be false
    end

    it 'should not change is_old not update email' do
      user.update(nickname: 'testname')
      expect(user.is_old?).to be true
    end
  end

  describe 'two_factor' do
    let(:user) { create(:basic_user) }
    it 'should regenerate secret_key every time' do
      init_key = user.otp_secret_key
      user.two_factor_qr
      expect(user.otp_secret_key).not_to eq(init_key)
    end

    it 'should disable two factor when enabled' do
      user.update_attribute(:two_factor_enable, true)
      expect(user.two_factor_switch).to be false
    end

    it 'should enable two factor with right code' do
      code = user.otp_code
      expect(user.two_factor_switch(code)).to be true
    end

    it 'should not enable two factor with wrong code' do
      expect(user.two_factor_switch).to be false
    end
  end
end
