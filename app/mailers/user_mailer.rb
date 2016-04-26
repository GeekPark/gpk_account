class UserMailer < ApplicationMailer
  def send_verify_code(user, code)
    @code = code
    mail(to: user.email, subject: '您的邮箱验证码')
  end
end
