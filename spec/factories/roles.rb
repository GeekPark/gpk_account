FactoryGirl.define do
  factory :user_role, class: Role do
    name 'User'
    slug 'user'
  end

  factory :admin_role, class: Role do
    name 'Administrator'
    slug 'admin'
  end
end
