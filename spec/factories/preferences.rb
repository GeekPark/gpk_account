FactoryGirl.define do
  factory :preference do
    association :user, factory: :basic_user
  end
end
