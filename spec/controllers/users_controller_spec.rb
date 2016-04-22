require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  let(:user) { create(:user, :with_email) }

  describe '#check_exist' do
    it 'should return false user not exist' do
      get 'check_exist', user: { email: 'test@geekpark.net' }
      expect(response.body).to eq({ exist: false }.to_json)
    end

    it 'should return true user exist' do
      get 'check_exist', user: { email: user.email }
      expect(response.body).to eq({ exist: true }.to_json)
    end
  end

  describe '#send_verify_code' do
    context 'verify code failed' do
      it 'should return error' do
        get 'send_verify_code', user: { email: 'test@geekpark.net' }
        expect(response).to have_http_status(:not_acceptable)
        expect(JSON.parse(response.body)['errors']).to include('Captcha invalid!')
      end
    end

    context 'very code success' do
      before do
        allow_any_instance_of(ActionController::Base).to receive(:verify_rucaptcha?).and_return(true)
      end

      it 'should return error when user exist' do
        get 'send_verify_code', user: { email: user.email }
        expect(response).to have_http_status(:not_acceptable)
        expect(JSON.parse(response.body)['errors']).to include('Email has already been taken')
      end

      it 'should return success after send' do
        get 'send_verify_code', user: { mobile: '13711112222' }
        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body)['success']).to include('sended')
      end
    end
  end
end
