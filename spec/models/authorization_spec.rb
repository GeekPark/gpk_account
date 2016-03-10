require 'rails_helper'

RSpec.describe Authorization, type: :model do
  let(:wechat) { build(:authorization) }
  let(:weibo) { build(:authorization, platform: 'weibo', uid: 'some_uid') }

  describe '.save' do
    context 'when wechat' do
      it 'with valid open_id' do
        expect(wechat).to be_valid
      end

      it 'without open_id' do
        wechat.open_id = nil
        expect(wechat).not_to be_valid
      end
    end

    context 'when weibo' do
      it 'with valid uid' do
        expect(weibo).to be_valid
      end

      it 'without uid' do
        weibo.uid = nil
        expect(weibo).not_to be_valid
      end
    end
  end
end
