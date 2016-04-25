jest.unmock('../../src/reducers/user');
jest.unmock('deep-freeze');

import deepFreeze from 'deep-freeze';
import user from '../../src/reducers/user';

describe('user reducer', () => {
  const before = {
    isEmail: false,
    id: '',
    isValidated: false,
  };

  deepFreeze(before);

  it('update user info', () => {
    const after = {
      isEmail: true,
      id: 'test@geekpark.net',
      isValidated: false,
    };

    expect(
      user(before, { type: 'UPDATE_USER', user: {
        isEmail: true,
        id: 'test@geekpark.net',
        isValidated: false,
      } })
    ).toEqual(after);
  });

  it('set validated', () => {
    const after = { ...before, isValidated: true };

    expect(
      user(before, { type: 'VALIDATE_USER' })
    ).toEqual(after);
  });
});
