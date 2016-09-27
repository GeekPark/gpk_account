filename = File.join(Rails.root, ENV['CERITFICATE'] || 'no_such_file')

if Rails.env.production?
  APNGETEWAY = Houston::APPLE_PRODUCTION_GATEWAY_URI
  APN = Houston::Client.production
else
  APNGETEWAY = Houston::APPLE_DEVELOPMENT_GATEWAY_URI
  APN = Houston::Client.development
end
PASSPHRASE = (ENV['CERITFICATE_PASSWORD'] || '').freeze
CERTIFICATE = File.exist?(filename) ? File.read(filename).freeze : nil

APN.certificate = CERTIFICATE
