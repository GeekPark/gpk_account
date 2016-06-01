require 'rails_helper'

RSpec.describe 'ApiAuthorizes', type: :request do
  describe 'doorkeeper_authorize' do
    it 'return 401 when token is wrong' do
      get api_v1_user_path
      expect(response.status).to eq(401)
    end
  end
end
