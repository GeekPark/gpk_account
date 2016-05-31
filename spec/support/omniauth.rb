OmniAuth.config.test_mode = true

module OmniauthMacros
  def mock_wechat_auth(option = nil)
    OmniAuth.config.mock_auth[:wechat] = {
      'provider' => option || 'wechat',
      'uid' => '123545',
      'info' => {
        'nickname' => 'mockuser',
        'city' => 'Chaoyang',
        'avatar' => 'http://test.com/test.jpg'
      },
      'credentials' => {
        'token' => 'mock_token',
        'refresh_token' => 'mock_refresh_token',
        'expires_at' => 2.hours.from_now.to_i,
        'expires' => true
      },
      'extra' => {}
    }
  end
end
