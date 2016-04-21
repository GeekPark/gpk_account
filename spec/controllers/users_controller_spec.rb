require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  describe '#check_exist' do
    it 'should return false user not exist' do
      get 'check_exist', loginname: 'test@geekpark.net'
      expect(response.body).to eq({ exist: false }.to_json)
    end

    it 'should return true user exist' do
      create(:user, email: 'test@geekpark.net')
      get 'check_exist', loginname: 'test@geekpark.net'
      expect(response.body).to eq({ exist: true }.to_json)
    end
  end

  describe '#send_verify_code' do
  end
end
