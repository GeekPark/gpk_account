class UserMailer < ApplicationMailer
  def send_verify_code(email, code)
    @code = code
    mail(to: email, subject: '[极客公园] Hi, 极客 您的邮箱校验码')
  end
end
