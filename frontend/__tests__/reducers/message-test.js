jest.unmock('../../src/reducers/message');
jest.unmock('deep-freeze');

import deepFreeze from 'deep-freeze';
import message from '../../src/reducers/message';

describe('message reducer', () => {
  const before = {
    isShow: false,
    msgType: 'error',
    msg: '',
  };

  deepFreeze(before);

  it('show message', () => {
    const after = {
      isShow: true,
      msgType: 'success',
      msg: 'hello, world',
    };

    expect(
      message(before, { type: 'SHOW_MESSAGE', msgType: 'success', msg: 'hello, world' })
    ).toEqual(after);
  });

  it('close message', () => {
    expect(
      message(before, { type: 'CLOSE_MESSAGE' })
    ).toEqual({ ...before, isShow: false });
  });
});
