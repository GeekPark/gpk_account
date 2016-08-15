require 'rails_helper'

RSpec.describe Settings::EditEmailOrMobileController, type: :controller do
  describe '#patch' do
    include_context 'prepare verify code' do
      let(:key) { 'new@example.com' }
    end

    let(:user) { create(:basic_user) }
    let(:eeom) { return { type: 'email', email: 'new@example.com', verify_code: @code } }

    before do
      warden.set_user(user)
    end

    it 'should return error for normal user when not identitied' do
      patch :update, eeom
      expect(response).to have_http_status(422)
      expect(JSON.parse(response.body)['errors']).to include('请先验证您的身份')
    end

    context 'identified' do
      before do
        allow_any_instance_of(User).to receive(:identified?).and_return(true)
      end

      it 'should return error when verify code incorrect' do
        eeom[:verify_code] = eeom[:verify_code].to_i.next.to_s
        patch :update, eeom
        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body)['errors']).to include('验证码输入错误')
      end

      it 'should return error when email was used' do
        create(:basic_user, email: 'new@example.com')
        patch :update, eeom
        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body)['errors']).to include('Email已经被使用')
      end

      it 'should return error when email not valid' do
        eeom[:email] = 'new'
        patch :update, eeom
        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body)['errors']).to include('Email是无效的')
      end

      it 'should update user email' do
        patch :update, eeom
        expect(response).to have_http_status(:success)
        expect(user.reload.email).to eq(eeom[:email])
      end
    end

    context 'not identified for sns user' do
      let(:sns_user) { create(:sns_user) }
      before { warden.set_user(sns_user) }

      it 'should update user email' do
        patch :update, eeom
        expect(response).to have_http_status(:success)
        expect(sns_user.reload.email).to eq(eeom[:email])
      end
    end

    context 'not identitied for old user' do
      let(:old_user) { create(:old_user) }
      before { warden.set_user(old_user) }

      it 'should update user email' do
        patch :update, eeom
        expect(response).to have_http_status(:success)
        expect(old_user.reload.email).to eq(eeom[:email])
      end
    end
  end
end
