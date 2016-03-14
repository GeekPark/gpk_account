FactoryGirl.define do
  factory :user do
    sequence(:email) { |n| "name#{n}@example.com" }
    sequence(:mobile) { |n| "1300000000#{n}" }
    sequence(:username) { |n| "username#{n}" }
  end
end
