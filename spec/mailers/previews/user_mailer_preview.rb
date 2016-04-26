# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  def send_verify_code
    UserMailer.send_verify_code(User.new(email: 'test@test.com'), '123111')
  end
end
