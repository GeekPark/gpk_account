require 'rails_helper'

RSpec.describe UserMailer, type: :mailer do
  describe '#send_verify_code' do
    let(:user) { build(:basic_user) }
    let(:mail) { UserMailer.send_verify_code(user, '123123').deliver_now }

    it 'renders the subject' do
      expect(mail.subject).to eq('您的邮箱验证码')
    end

    it 'renders the receiver email' do
      expect(mail.to).to eq([user.email])
    end

    it 'renders the sender email' do
      expect(mail.from).to eq(['noreply@geekpark.net'])
    end

    it 'assigns @code' do
      expect(mail.body.encoded).to match('123123')
    end
  end
end
