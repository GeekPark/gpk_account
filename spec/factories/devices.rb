FactoryGirl.define do
  factory :device do
    sequence(:device_id) { |n| "device_id_#{n}" }
    last_actived_time Time.now.getlocal

    association :user, factory: :basic_user

    trait :with_broadcast do
      after(:create) do |device|
        BroadcastsDevicesRelation.create(device_id: device.id, broadcast_id: create(:broadcast).id)
        BroadcastsDevicesRelation.create(device_id: device.id, broadcast_id: create(:broadcast).id)
      end
    end
  end
end
