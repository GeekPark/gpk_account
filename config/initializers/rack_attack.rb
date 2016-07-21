class Rack::Attack
  whitelist('allow from localhost') do |req|
    '127.0.0.1' == req.ip || '::1' == req.ip
  end

  throttle('req/ip', limit: 400, period: 5.minutes) do |req|
    req.ip unless req.path.start_with?('/assets', '/static')
  end

  throttle('logins/ip', limit: 10, period: 5.minutes) do |req|
    req.ip if req.path == '/login' && req.post?
  end

  %w(/send_verify_code /api/v1/send_verify_code).each do |key|
    throttle("#{key}/ip", limit: 15, period: 1.hour) do |req|
      req.ip if req.path == key && req.post?
    end

    throttle("#{key}/email_or_mobile", limit: 5, period: 3.minutes) do |req|
      if req.path == key && req.post?
        req.params['email'].presence || req.params['mobile'].presence
      end
    end
  end

  Rack::Attack.throttled_response = lambda do |env|
    [
      429,
      { 'Retry-After' => env['rack.attack.match_data'][:period] },
      [{ errors: ['请求次数过多, 请稍后尝试'] }.to_json]
    ]
  end
end
