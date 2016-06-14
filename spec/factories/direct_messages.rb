FactoryGirl.define do
  factory :direct_message do
    content_type 'txt'
    content 'message content'
    association :user, factory: :basic_user
    association :to_user, factory: :basic_user
  end
end
