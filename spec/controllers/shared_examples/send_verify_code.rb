RSpec.shared_examples 'send verify code' do
  context 'captcha incorrect' do
    it 'should return error' do
      expect(subject).to have_http_status(422)
      expect(JSON.parse(subject.body)['errors']).to include('Captcha invalid!')
    end
  end

  context 'captcha correct' do
    before do
      allow_any_instance_of(UsersController).to receive(:verify_rucaptcha?).and_return(true)
    end

    it 'should return success after send' do
      expect(subject).to have_http_status(:success)
      expect(JSON.parse(subject.body)['success']).to include('Sended')
    end
  end
end
