require 'rails_helper'

RSpec.describe UserMailer, type: :mailer do
  describe '#send_verify_code' do
    let(:email) { 'test@geekpark.net' }
    let(:mail) { UserMailer.send_verify_code(email, '123456').deliver_now }

    it 'renders the subject' do
      expect(mail.subject).to eq('[极客公园] Hi, 极客 您的邮箱校验码')
    end

    it 'renders the receiver email' do
      expect(mail.to).to eq([email])
    end

    it 'renders the sender email' do
      expect(mail.from).to eq(['notification@mailer.geekpark.net'])
    end

    it 'assigns @code' do
      expect(mail.body.encoded).to match('123')
      expect(mail.body.encoded).to match('456')
    end
  end
end
