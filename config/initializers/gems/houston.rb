APN = Houston::Client.public_send(Rails.env)
APN.certificate = File.read(File.join(Rails.root, ENV['CERITFICATE']))
APNGETEWAY = Houston::APPLE_PRODUCTION_GATEWAY_URI
APNGETEWAY = Houston::APPLE_DEVELOPMENT_GATEWAY_URI
