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
  end
end
