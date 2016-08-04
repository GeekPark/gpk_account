require 'rails_helper'

RSpec.describe Api::V1::DirectMessagesController, type: :controller do
  let(:user) { create(:basic_user, :with_direct_messages, direct_messages_count: 20) }
  let(:write_token) { create(:write_access_token, resource_owner_id: user.id) }

  describe 'GET#index' do
    it 'return 20 direct_messages per page' do
      get :index, access_token: write_token.token
      expect(JSON.parse(response.body).length).to eq 20
    end
  end

  describe 'POST#create' do
    let(:from_user) { create(:basic_user) }
    let(:to_user) { create(:basic_user) }
    let(:create_token) { create(:write_access_token, resource_owner_id: from_user.id) }
    context 'when user allow send message' do
      it 'should create direct_message' do
        expect { post :create, access_token: create_token.token, to_user_id: to_user.id, content: 'test_data' }.to \
          change(DirectMessage, :count).by(1)
        expect(response).to be_success
      end

      it 'should create a notification' do
        expect { post :create, access_token: create_token.token, to_user_id: to_user.id, content: 'test_data' }.to \
          change(Notification, :count).by(1)
      end
    end

    context 'when user do not allow send message' do
      before { to_user.preference.update(receive_message: false) }
      it 'should return error' do
        post :create, access_token: create_token.token, to_user_id: to_user.id, content: 'test_data'
        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body)['error']).to include('当前用户拒绝接受消息')
      end
    end
  end

  describe 'GET#detail' do
    let(:from_user) { create(:basic_user) }
    context 'when no direct_message between' do
      it 'should return nothing' do
        get :detail, access_token: write_token.token, user_id: from_user.id
        expect(response).to be_success
        expect(JSON.parse(response.body).length).to eq 0
      end
    end

    context 'when have 10 direct_message' do
      before { create_list(:direct_message, 10, user: from_user, to_user: user) }
      it 'should return 10' do
        get :detail, access_token: write_token.token, user_id: from_user.id
        expect(response).to be_success
        expect(JSON.parse(response.body).length).to eq 10
      end
    end
  end

  describe 'PATCH#read_all' do
    let(:from_user) { create(:basic_user) }
    before { create_list(:direct_message, 10, user: from_user, to_user: user) }

    it 'should have 10 unread message' do
      expect(user.unread_dm_between(from_user.id).count).to eq 10
    end

    it 'set direct message to read' do
      patch :read_all, user_id: from_user.id, access_token: write_token.token
      expect(user.unread_dm_between(from_user.id).count).to eq 0
    end
  end
end
