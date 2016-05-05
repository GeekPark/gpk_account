jest.unmock('../../src/reducers/avatar_url');

import deepFreeze from 'deep-freeze';
import avatarURL from '../../src/reducers/avatar_url';

describe('avatar url test', () => {
  const before = null;

  deepFreeze(before);

  it('change avatar url', () => {
    const afterSend = 'test.png';

    expect(
      avatarURL(before, { type: 'CHANGE_AVATAR', url: afterSend })
    ).toEqual(afterSend);
  });
});
