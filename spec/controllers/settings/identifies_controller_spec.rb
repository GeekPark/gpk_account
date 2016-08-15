require 'rails_helper'

RSpec.describe Settings::IdentifiesController, type: :controller do
  describe 'POST #create' do
    let(:user) { create(:basic_user) }
    let(:verify_code) { VerifyCode.new(type: 'email', email: user.email).tap(&:save) }
    before do
      warden.set_user(user)
    end

    it 'should set identify token to cookies' do
      post 'create', type: 'email', verify_code: verify_code.code
      expect(response).to have_http_status(:success)
      expect(cookies[:identify_token]).to eq(Rails.cache.read("identify_token:#{user.id}"))
      expect(JSON.parse(response.body)['id']).to eq(user.id)
    end

    it 'should return error when verify code invalid' do
      post 'create', type: 'email', verify_code: verify_code.code.to_i.next.to_s
      expect(response).to have_http_status(422)
      expect(JSON.parse(response.body)['errors']).to include('验证码输入错误')
    end
  end
end
