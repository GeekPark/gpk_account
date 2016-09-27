APN = Houston::Client.public_send(Rails.env)
filename = File.join(Rails.root, ENV['CERITFICATE'])

APNGETEWAY = if Rails.env.production?
               Houston::APPLE_PRODUCTION_GATEWAY_URI
             else
               Houston::APPLE_DEVELOPMENT_GATEWAY_URI
             end
CERTIFICATE = File.read(filename).freeze if File.exist?(filename)
PASSPHRASE = (ENV['CERITFICATE_PASSWORD'] || '').freeze

APN.certificate = CERTIFICATE
