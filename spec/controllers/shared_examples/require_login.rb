RSpec.shared_examples 'return 401 without login' do
  it 'should return 401 unauthorized' do
    expect(subject).to have_http_status(:unauthorized)
  end
end

RSpec.shared_examples 'redirect_to login_url' do
  it 'redirect_to login_url' do
    expect(subject).to redirect_to(login_url)
  end
end

RSpec.shared_examples 'return 404 without admin' do
  it 'should return 404' do
    expect(subject).to have_http_status(404)
  end
end
