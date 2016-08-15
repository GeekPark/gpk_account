require 'rails_helper'

RSpec.describe VerifyCodesController, type: :controller do
  describe 'POST #send_verify_code' do
    let(:user) { create(:user, :with_email, :with_mobile) }

    context 'captcha incorrect' do
      it 'should return error' do
        post 'create', type: 'mobile', mobile: user.mobile
        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body)['errors']).to include('验证码不正确')
      end
    end

    context 'captcha correct' do
      before do
        allow_any_instance_of(VerifyCodesController).to receive(:verify_rucaptcha?).and_return(true)
      end

      it 'should return success after send' do
        post 'create', type: 'email', email: user.email
        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body)['success']).to include('Sended')
      end
    end

    context 'when user has logged in' do
      before do
        warden.set_user(user)
      end

      it 'should send to self when params only have a type' do
        post 'create', type: 'mobile'
        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body)['success']).to include('Sended')
        expect(Rails.cache.read("verify_code:#{user.mobile}")).to be_truthy
      end

      it 'should send to new mobile when params have a mobile' do
        post 'create', type: 'mobile', mobile: '13111111111'
        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body)['success']).to include('Sended')
        expect(Rails.cache.read('verify_code:13111111111')).to be_truthy
      end
    end
  end
end
