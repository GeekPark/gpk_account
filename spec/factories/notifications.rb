FactoryGirl.define do
  factory :notification do
    content_type 'event'
    content 'this is a test'
    sequence(:parent_id) { |n| "parent_id_#{n}" }
    association :user, factory: :basic_user
  end
end
