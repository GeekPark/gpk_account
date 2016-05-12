RSpec.shared_context 'prepare api signature' do
  let(:application) { create(:application) }

  def calculate_signature
    Digest::SHA256.hexdigest(origin_hash.flatten_nested.sort.flatten.join + application.secret)
  end
end
