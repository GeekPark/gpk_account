require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'user validation' do
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

  describe 'User tokens' do
    let(:user) { create(:basic_user) }
    let!(:token) { create(:write_access_token, resource_owner_id: user.id) }
    it 'has_many access_tokens' do
      expect(user.access_tokens.first).to eq token
    end

    it 'do not count revoked token' do
      token.revoke
      expect(user.access_tokens.count).to eq 0
    end

    it 'revoked after password change' do
      user.update(password: '123123')
      expect(user.access_tokens.count).to eq 0
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

  describe 'wechat alias' do
    let!(:user) { User.create_with_omniauth mock_wechat_auth('wechatservice') }

    it 'should save provider as wechat' do
      expect(user.authorizations.first.provider).to eq('wechat')
    end

    it 'should find provider by wechat' do
      auth = mock_wechat_auth('wechatservice')
      authorization = Authorization.find_by_provider_and_uid(Authorization.providers[auth['provider']], auth['uid'])
      expect(authorization.user).to eq(user)
    end
  end

  describe 'roles' do
    let(:user) { create(:basic_user) }

    it 'should always has at least one role' do
      expect(user.roles.length).to eq(1)
    end

    it 'merge duplicated roles' do
      user.update_attribute(:roles, %w(admin admin))
      expect(user.roles.grep('admin').length).to eq(1)
    end
  end
end
