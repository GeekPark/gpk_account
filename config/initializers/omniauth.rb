Rails.application.config.middleware.use OmniAuth::Builder do
  provider :wechat, ENV['WECHAT_ID'], ENV['WECHAT_SECRET'], scope: 'snsapi'
end
