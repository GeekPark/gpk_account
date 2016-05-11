require 'rails_helper'

RSpec.describe Api::V1::RegisterController, type: :controller do
  let(:user) { build(:user, :with_email, :with_mobile) }

  describe 'GET#captcha' do
    it 'should return captcha_key' do
      get :captcha
      expect(response.header['captcha_key']).not_to be nil
    end
  end

  describe 'GET#send_verify_code' do
    it 'should return error' do
      get :send_verify_code
      expect(response).to have_http_status(422)
    end
  end

  describe 'POST#register' do
    it 'should verify_signature right'
    it 'should create user'
    it 'should return users token'
  end
end
