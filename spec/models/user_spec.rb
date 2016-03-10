require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { build(:user) }

  describe '.save' do
    context 'with valid email,mobile,username' do
      it { expect(user).to be_valid }
    end

    context 'without email,mobile' do
      it do
        user.email = user.mobile = ''
        expect(user).not_to be_valid
      end
    end

    context 'with only email' do
      it do
        user.mobile = user.username = nil
        expect(user).to be_valid
      end
    end

    context 'with only mobile' do
      it do
        user.email = user.username = nil
        expect(user).to be_valid
      end
    end
  end
end
