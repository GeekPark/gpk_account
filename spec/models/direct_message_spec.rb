require 'rails_helper'

RSpec.describe DirectMessage, type: :model do
  it 'should have content_type' do
    expect(create(:direct_message).content_type).not_to be_nil
  end

  it 'shoold have user and to_user' do
    expect(create(:direct_message).user).not_to be_nil
    expect(create(:direct_message).to_user).not_to be_nil
  end

  it 'should order by created_at desc' do
    dm = create(:direct_message)
    create(:direct_message, created_at: 1.minute.ago)
    expect(DirectMessage.first).to eq(dm)
  end
end
