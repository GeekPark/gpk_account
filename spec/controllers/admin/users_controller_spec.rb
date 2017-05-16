require 'rails_helper'

RSpec.describe Admin::UsersController, type: :controller do
  let(:user) { create(:full_user) }
  let(:admin) { create(:user, :admin) }

  describe 'show' do
    it 'requires admin permission' do
      get :show, id: user.id
      expect(response.status).to eq(401)
    end

    it 'returns user details' do
      warden.set_user(admin)
      get :show, id: user.id
      expect(response).to be_success
      expect(JSON.parse(response.body)['id']).to eq(user.id)
      expect(JSON.parse(response.body)['roles']).to match_array(user.roles)
    end
  end

  describe 'index' do
    it 'requires admin permission' do
      get :index
      expect(response.status).to eq(401)
    end

    it 'list users' do
      warden.set_user(admin)
      get :index
      expect(response).to be_success
      expect(result).to be_kind_of(Array)
      expect(result[0]).not_to be_nil
      expect(result[0][:roles]).not_to be_nil
    end

    it 'list by roles' do
      warden.set_user(admin)
      get :index,
          mode: 'filter',
          role: 'admin'
      expect(response).to be_success
      expect(result).to be_kind_of(Array)
      expect(result.all? { |x| 'admin'.in? x[:roles] }).to be_truthy
    end
  end

  describe 'update' do
    it 'requires admin permission' do
      patch :update, id: user.id
      expect(response.status).to eq(401)
    end

    it 'update user roles' do
      warden.set_user(admin)
      expect {
        patch :update,
              id: user.id,
              roles: ['user', 'admin']
        expect(response).to be_success
      }.to change {
        user.reload.roles
      }.to match_array ['user', 'admin']
    end

    it 'doesn\'t touch other props' do
      warden.set_user(admin)
      expect {
        patch :update,
              id: user.id,
              roles: ['user', 'admin']
        expect(response).to be_success
      }.not_to change { user.reload.nickname }
    end
  end
end
