jest.unmock('../../src/reducers/server');
jest.unmock('deep-freeze');

import deepFreeze from 'deep-freeze';
import server from '../../src/reducers/server';

describe('server reducer', () => {
  const before = {};
  const before1 = {
    a: 1,
    b: 2,
  };

  deepFreeze(before);
  deepFreeze(before1);

  it('set server', () => {
    const after = {
      test: 123,
    };
    const after2 = {
      a: 3,
      b: 2,
    };

    expect(
      server(before, { type: 'SET_STORE', data: after })
    ).toEqual(after);

    expect(
      server(before1, { type: 'SET_STORE', data: { a: 3 } })
    ).toEqual(after2);
  });
});
