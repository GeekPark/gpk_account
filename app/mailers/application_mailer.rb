class ApplicationMailer < ActionMailer::Base
  after_action :diff_tencent_email
  default from: 'notification@mg.geekpark.net'
  layout 'mailer'

  def diff_tencent_email
    mail_to = mail.to.first
    return unless tencent?(mail_to)
    message.perform_deliveries = false
    send_through_sendcloud
  end

  private

  def tencent?(email)
    email.end_with?('@qq.com')
  end

  def send_through_sendcloud
    content = {
      api_user: ENV['SENDCLOUD_USER'],
      api_key: ENV['SENDCLOUD_KEY'],
      from: mail.from.first,
      subject: mail.subject,
      html: mail.body.raw_source,
      to: mail.to.first
    }
    Net::HTTP.post_form(URI(ENV['SENDCLOUD_URL']), content)
  end
end
