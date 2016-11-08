# coding: utf-8
class UserMailer < ApplicationMailer
  def send_verify_code(email, code)
    @code = code
    mail(to: email, subject: '[极客公园] Hi, 极客 您的邮箱校验码')
  rescue Net::ReadTimeout, Net::OpenTimeout => e
    Rails.logger.error 'Send verification code timeout'
    Rails.logger.error e.message
    Rails.logger.error caller
    retry
  end
end
