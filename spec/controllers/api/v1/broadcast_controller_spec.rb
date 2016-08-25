require 'rails_helper'

RSpec.describe Api::V1::BroadcastsController, type: :controller do
  describe 'POST#create' do
    include_context 'prepare api signature'
    let(:broadcast_params) { attributes_for(:broadcast) }

    context 'when valid signature' do
      it 'return 422 and message' do
        post :create, broadcast_params.merge(format: :json, client_id: application.uid)
        expect(JSON.parse(response.body)['error']).to include('Signature verify failed')
      end
    end

    context 'when with valid params' do
      let(:origin_hash) { attributes_for(:broadcast).merge(timestamp: Time.current.to_i, client_id: application.uid) }
      it 'create a broadcast' do
        expect { post :create, origin_hash.merge(signature: calculate_signature, format: :json) }.to \
          change(Broadcast, :count).by(1)
        expect(response).to be_success
      end
    end

    context 'when params invalid' do
      let(:origin_hash) do
        attributes_for(:broadcast, content: nil).merge(timestamp: Time.current.to_i, client_id: application.uid)
      end
      it 'return error' do
        post :create, origin_hash.merge(signature: calculate_signature, format: :json, title: nil)
        expect(response).to have_http_status(422)
      end
    end
  end
end
