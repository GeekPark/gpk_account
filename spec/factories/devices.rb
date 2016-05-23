FactoryGirl.define do
  factory :device do
    sequence(:device_id) { |n| "device_id_#{n}" }
    last_actived_time Time.now.getlocal

    association :user, factory: :basic_user
  end
end
