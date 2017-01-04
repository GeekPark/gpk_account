require 'rails_helper'

RSpec.describe 'ApplicationManagements' do
  include Warden::Test::Helpers

  after { Warden.test_reset! }

  describe 'GET /oauth2/applications' do
    it 'redirect root_path user not login' do
      get oauth_applications_path
      expect(response).to redirect_to(root_path)
    end

    it 'redirect root_path user not admin' do
      login_as create(:basic_user)
      get oauth_applications_path
      expect(response).to redirect_to(root_path)
    end

    it'success when user is admin' do
      login_as create(:basic_user, :admin)
      get oauth_applications_path
      expect(response).to be_success
    end
  end
end
