FactoryGirl.define do
  factory :broadcast do
    title '测试通过'
    content_type 'activity'
    content '当前测试已经通过'
    send_at Time.now.getlocal
    redirect_id 'just a uuid'
  end
end
