require 'rails_helper'

RSpec.describe Preference, type: :model do
  it 'create default email preference' do
    preference = create :preference
    expect(preference.email[:enabled]).to eq(true)
    expect(preference.subscriptions).to include(:event, :report)
  end
end
