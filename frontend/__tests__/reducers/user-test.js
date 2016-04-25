jest.unmock('../../src/reducers/user');
jest.unmock('deep-freeze');

import deepFreeze from 'deep-freeze';
import user from '../../src/reducers/user';

describe('user reducer', () => {
  const before = {
    isEmail: false,
    id: '',
  };

  deepFreeze(before);

  it('update user info', () => {
    const after = {
      isEmail: true,
      id: 'test@geekpark.net',
    };

    expect(
      user(before, { type: 'UPDATE_USER', user: {
        isEmail: true,
        id: 'test@geekpark.net',
      } })
    ).toEqual(after);
  });
});
