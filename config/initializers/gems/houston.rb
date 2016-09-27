if Rails.env.production?
  APNGETEWAY = Houston::APPLE_PRODUCTION_GATEWAY_URI
  APN = Houston::Client.production
else
  APNGETEWAY = Houston::APPLE_DEVELOPMENT_GATEWAY_URI
  APN = Houston::Client.development
end

begin
  certificate_file = File.join(Rails.root, ENV['CERTIFICATE'])
  PASSPHRASE = (ENV['CERTIFICATE_PASSWORD'] || '').freeze
  CERTIFICATE = File.read(certificate_file).freeze
  APN.certificate = CERTIFICATE
  HOUSTON_AVAILABLE = true
rescue TypeError, Errno::ENOENT, Errno::EISDIR
  HOUSTON_AVAILABLE = false
end
