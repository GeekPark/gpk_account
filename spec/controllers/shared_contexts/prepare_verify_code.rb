RSpec.shared_context 'prepare verify code' do
  let(:key) { 'new@email.com' }

  before do
    @code = rand(100_000..999_999).to_s
    Rails.cache.write("verify_code:#{key}", @code)
  end

  after do
    Rails.cache.clear
  end
end
