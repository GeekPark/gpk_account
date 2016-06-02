require 'rails_helper'

RSpec.describe Preference, type: :model do
  it 'create default email preference' do
    user = create :basic_user
    expect(user.preference.email[:enabled]).to eq(true)
    expect(user.preference.subscriptions).to include(:event, :report)
  end

  it 'email set to false unless user email validated' do
    user = create :old_user
    expect(user.preference.email[:enabled]).to eq(false)
  end

  it 'cant set email preference unless have validated email' do
    preference = (create :sns_user).preference
    preference.email[:enabled] = true
    expect(preference.valid?).to eq false
    expect(preference.errors[:email]).to include('请先验证您的邮箱')
  end
end
