jest.unmock('../../src/reducers/verify_code');
jest.unmock('deep-freeze');

import deepFreeze from 'deep-freeze';
import verifyCode from '../../src/reducers/verify_code';

describe('verifyCode reducer', () => {
  const before = {
    isFirst: true,
    pending: false,
    countdown: 0,
  };

  deepFreeze(before);

  it('first send', () => {
    const after = {
      isFirst: false,
      pending: true,
      countdown: 60,
    };

    expect(
      verifyCode(before, { type: 'SEND_VERIFY_CODE' })
    ).toEqual(after);
  });

  it('reset countdown', () => {
    const after = {
      isFirst: false,
      pending: false,
      countdown: 0,
    };

    expect(
      verifyCode(before, { type: 'RESET_VERIFY_CODE' })
    ).toEqual(after);
  });
});
