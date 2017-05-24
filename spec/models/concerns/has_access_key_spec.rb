require 'rails_helper'

RSpec.describe HasAccessKey do
  let(:clazz) { Struct.new(:id, :roles) { include HasAccessKey } }
  let(:user)  { clazz.new('1', %w(admin user)) }

  describe 'access_key' do
    it 'generates a access key' do
      expect(user.send(:generate_access_key)).to be_present
    end

    it 'saves cache in access_key' do
      key = user.access_key
      value = User.local_redis.fetch("access_key:#{key}")
      expect(value).to be_present
      expect(value.split(':')).to eq(['1', 'admin,user'])
    end

    it 'acquires user from an access key' do
      key = user.access_key
      uzer = user
      clazz.define_singleton_method :find_by do |id: 0|
        uzer if id == uzer.id
      end
      expect(clazz.from_access_key(key)).to eq(user)
    end
  end
end
