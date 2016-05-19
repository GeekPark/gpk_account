require 'rails_helper'

RSpec.describe 'RackAttack' do
  include Warden::Test::Helpers
  after { Warden.test_reset! }

  describe 'rack_attack' do
    after { Rails.cache.clear }
    describe 'Users#send_verify_code' do
      it 'limit 15 times an hour per ip' do
        allow_any_instance_of(UsersController).to receive(:verify_rucaptcha!).and_return(true)
        15.times do
          post '/send_verify_code', {}, 'REMOTE_ADDR' => '1.2.3.4'
        end
        expect(response.status).not_to be(429)
        post '/send_verify_code', {}, 'REMOTE_ADDR' => '1.2.3.4'
        expect(response.status).to be(429)
      end
    end

    describe 'Sessions#create' do
      it 'limit 5 time every 3 minute per ip' do
        5.times do
          post '/login', {}, 'REMOTE_ADDR' => '1.2.3.4'
        end
        expect(response.status).not_to be(429)
        post '/login', {}, 'REMOTE_ADDR' => '1.2.3.4'
        expect(response.status).to be(429)
      end
    end

    describe 'Settings#send_verify_code' do
      it 'limit 8 time a day per user' do
        login_as create(:basic_user)
        8.times do
          post '/settings/send_verify_code', { way: 'mobile' }, 'REMOTE_ADDR' => '1.2.3.4'
        end
        expect(response.status).not_to be(429)
        post '/settings/send_verify_code', { way: 'mobile' }, 'REMOTE_ADDR' => '1.2.3.4'
        expect(response.status).to be(429)
      end
    end

    describe 'api#send_verify_code' do
      it 'limit 15 times an hour per ip' do
        15.times do
          post '/api/v1/send_verify_code', {}, 'REMOTE_ADDR' => '1.2.3.4'
        end
        expect(response.status).not_to be(429)
        post '/api/v1/send_verify_code', {}, 'REMOTE_ADDR' => '1.2.3.4'
        expect(response.status).to be(429)
      end
    end
  end
end
