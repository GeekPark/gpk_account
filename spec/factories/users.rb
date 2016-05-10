FactoryGirl.define do
  factory :user do
    sequence(:nickname) { |n| "user#{n}" }
    title 'director'
    birthday 30.years.ago
    city 440_300
    is_old false

    trait :old_user do
      is_old true
    end
    trait :without_validation do
      to_create { |instance| instance.save(validate: false) }
    end

    trait :with_wechat_authorization do
      after(:create) { |user| create(:wechat_authorization, user: user) }
    end

    trait :with_weibo_authorization do
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

    trait :with_avatar do
      avatar { Rack::Test::UploadedFile.new(Rails.root.join('app', 'assets', 'images', 'logo.png')) }
    end

    factory :full_user, traits: [:with_email, :with_mobile, :with_password,
                                 :with_wechat_authorization, :with_weibo_authorization]
    factory :basic_user, traits: [:with_email, :with_password]
    factory :old_user, traits: [:with_email, :with_password, :old_user]
    factory :sns_user, traits: [:without_validation, :with_wechat_authorization]
  end
end
