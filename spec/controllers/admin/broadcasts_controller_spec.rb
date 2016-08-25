require 'rails_helper'

RSpec.describe Admin::BroadcastsController, type: :controller do
  let(:user)  { create(:basic_user) }
  let(:admin) { create(:user, :admin) }

  describe 'without login or not admin' do
    context 'not login' do
      it 'raise error' do
        expect { get :index }.to raise_error(ActionController::RoutingError)
      end
    end

    context 'not admin' do
      before { warden.set_user(user) }
      it 'raise error' do
        expect { get :index }.to raise_error(ActionController::RoutingError)
      end
    end
  end

  describe 'CRUD' do
    before { warden.set_user(admin) }

    describe 'Get #index' do
      it 'return 200' do
        get :index
        expect(response).to have_http_status(200)
      end

      context 'with type' do
        before do
          create(:broadcast, :activity, content: 'activity broadcast')
          create(:broadcast, :topic, content: 'topic broadcast')
        end
        it 'return activity broadcast' do
          get :index, type: 'activity_type'
          expect(assigns(:broadcasts).last&.content).to include('activity')
        end
        it 'return topic broadcast' do
          get :index, type: 'topic_type'
          expect(assigns(:broadcasts).last&.content).to include('topic')
        end
      end
    end

    describe 'Get #new' do
      it 'return 200' do
        get :new
        expect(response).to have_http_status(200)
      end
    end

    describe 'Post #create' do
      context 'valid params' do
        it 'create a broadcast' do
          post :create, attributes_for(:broadcast)
          expect(JSON.parse(response.body)['redirect']).to include(admin_broadcasts_path)
        end
      end

      context 'invalid params' do
        it 'render new' do
          post :create, attributes_for(:broadcast, content: nil)
          expect(response).to have_http_status(422)
          expect(JSON.parse(response.body)['errors']).to include('Content不能为空字符')
        end
      end
    end
  end
end
