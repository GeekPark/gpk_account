FactoryGirl.define do
  factory :user do
    trait :without_validation do
      to_create { |instance| instance.save(validate: false) }
    end

    trait :with_wechat_authorization do
      after(:create) { |user| create(:wechat_authorization, user: user) }
    end

    trait :with_webo_authorization do
      after(:create) { |user| create(:weibo_authorization, user: user) }
    end

    trait :with_email do
      sequence(:email) { |n| "user#{n}@geekpark.net" }
    end

    trait :with_mobile do
      sequence(:mobile) { |n| format('%s%05d', '130101', n) }
    end

    trait :with_password do
      password 'password'
    end

    trait :with_username do
      sequence(:username) { |n| "user#{n}" }
    end
  end
end
