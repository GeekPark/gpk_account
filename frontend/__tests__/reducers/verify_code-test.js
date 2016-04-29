jest.unmock('../../src/reducers/verify_code');
jest.unmock('deep-freeze');

import deepFreeze from 'deep-freeze';
import verifyCode from '../../src/reducers/verify_code';

describe('verifyCode reducer', () => {
  const before = {
    isFirst: true,
    countdown: 0,
  };

  deepFreeze(before);

  it('first send validate code', () => {
    const afterSend = {
      isFirst: false,
      countdown: 60,
    };

    expect(
      verifyCode(before, { type: 'SEND_VERIFY_CODE' })
    ).toEqual(afterSend);
  });

  it('reset countdown when 60s later', () => {
    const afterReset = {
      isFirst: true,
      countdown: 0,
    };
    const beforeReset = {
      isFirst: false,
      countdown: 20,
    };

    expect(
      verifyCode(beforeReset, { type: 'RESET_VERIFY_CODE' })
    ).toEqual(afterReset);
  });

  it('countdown', () => {
    const after = {
      isFirst: true,
      countdown: 20,
    };

    expect(
      verifyCode(before, { type: 'UPDATE_COUNTDOWN', countdown: 20 })
    ).toEqual(after);
  });
});
