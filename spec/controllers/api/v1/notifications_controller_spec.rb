require 'rails_helper'

RSpec.describe Api::V1::NotificationsController, type: :controller do
  let(:user) { create(:basic_user, :with_notifications, notifications_count: 20) }
  let(:write_token) { create(:write_access_token, resource_owner_id: user.id) }

  describe 'GET#index' do
    it 'return 10 notifications per page' do
      get :index, access_token: write_token.token, scope: 'event'
      expect(JSON.parse(response.body).length).to eq 10
      expect(response.header['unread_count']).to eq 20
      expect(response.header['Total']).to eq '20'
    end
  end

  describe 'POST#create' do
    include_context 'prepare api signature'
    let(:notification_params) { attributes_for(:notification) }
    let(:origin_hash) do
      {
        id: user.id,
        notification: notification_params,
        timestamp: Time.current.to_i,
        client_id: application.uid
      }
    end

    it 'should create notification' do
      expect { post :create, origin_hash.merge(signature: calculate_signature) }.to change(Notification, :count).by(21)
    end

    it 'should change user unread notification count' do
      post :create, origin_hash.merge(signature: calculate_signature)
      expect(JSON.parse(response.body)['count']).to eq 21
    end
  end

  describe 'read' do
    it 'changes notification unread status' do
      notification = user.notifications.first
      post :read, access_token: write_token.token, id: notification.id
      expect(notification.reload.unread).to eq false
      expect(user.reload.unread_notifications_count).to eq 19
    end
  end

  describe 'read_all' do
    it 'set all notifications to read' do
      post :read_all, access_token: write_token.token
      expect(user.reload.unread_notifications_count).to eq 0
    end
  end
end
