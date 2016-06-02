Rails.application.config.middleware.use OmniAuth::Builder do
  provider :wechat, ENV['WECHAT_ID'], ENV['WECHAT_SECRET']
  provider :weibo, ENV['WEIBO_ID'], ENV['WEIBO_SECRET']
  provider :wechatservice, ENV['WECHAT_SERVICE_ID'], ENV['WECHAT_SERVICE_SECRET']
end
