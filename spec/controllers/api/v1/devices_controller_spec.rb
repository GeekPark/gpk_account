require 'rails_helper'

RSpec.describe Api::V1::DevicesController, type: :controller do
  let(:user) { create(:full_user) }
  let(:write_token) { create(:write_access_token, resource_owner_id: user.id) }
  let(:device) { create(:device, user: user) }
  describe 'POST#create' do
    context 'when devise not exist' do
      it 'create a device' do
        expect { post :create, format: :json, device_id: 'device_id', access_token: write_token.token }.to \
          change(Device.all, :count).by(1)
        expect(response).to be_success
      end
    end

    context 'when device exist' do
      it 'update active time' do
        post :create, format: :json, device_id: device.device_id, access_token: \
          write_token.token
        expect(response).to be_success
        expect(Device.find_by_id(device.id).last_actived_time).to be > device.last_actived_time
      end
    end
  end

  describe 'POST#destroy' do
    it 'destroy a device' do
      delete :destroy, format: :json, device_id: device.device_id, access_token: \
        write_token.token
      expect(Device.find_by_id(device.id)).to eq nil
    end
  end
end
