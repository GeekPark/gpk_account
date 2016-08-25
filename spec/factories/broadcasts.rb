FactoryGirl.define do
  factory :broadcast do
    content '当前测试已经通过'
    send_at Time.now.getlocal
    redirect_id 'just a uuid'
  end

  trait :activity do
    content_type 'activity_type'
  end

  trait :topic do
    content_type 'topic_type'
  end
end
