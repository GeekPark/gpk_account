FactoryGirl.define do
  factory :authorization do
    platform 'wechat'
    open_id 'some_open_id'
    association :user, factory: :user
  end
end
