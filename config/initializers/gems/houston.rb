filename = File.join(Rails.root, ENV['CERITFICATE'])

if Rails.env.production?
  APNGETEWAY = Houston::APPLE_PRODUCTION_GATEWAY_URI
  APN = Houston::Client.production
else
  APNGETEWAY = Houston::APPLE_DEVELOPMENT_GATEWAY_URI
  APN = Houston::Client.development
end
CERTIFICATE = File.read(filename).freeze if File.exist?(filename)
PASSPHRASE = (ENV['CERITFICATE_PASSWORD'] || '').freeze

APN.certificate = CERTIFICATE
