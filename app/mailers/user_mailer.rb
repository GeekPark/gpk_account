class UserMailer < ApplicationMailer
  def send_verify_code(email, code)
    @code = code
    mail(to: email, subject: '您的邮箱验证码')
  end
end
