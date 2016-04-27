jest.unmock('../../src/reducers/server');
jest.unmock('deep-freeze');

import deepFreeze from 'deep-freeze';
import server from '../../src/reducers/server';

describe('server reducer', () => {
  const before = {};

  deepFreeze(before);

  it('set server', () => {
    const after = {
      test: 123,
    };

    expect(
      server(before, { type: 'SET_STORE', data: after })
    ).toEqual(after);
  });
});
