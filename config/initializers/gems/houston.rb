unless Rails.env.test?
  APN = Houston::Client.public_send(Rails.env)
  APN.certificate = File.read(File.join(Rails.root, 'notification.pem'))
end
