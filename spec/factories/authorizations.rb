FactoryGirl.define do
  factory :authorization do
    sequence(:uid)

    factory :weibo_authorization do
      provider 'weibo'
    end

    factory :wechat_authorization do
      provider 'wechat'
    end
  end
end
