jest.unmock('../../src/share/utils');

import { parseErr, tryKey } from '../../src/share/utils';

describe('utils test', () => {
  it('parseErr should work', () => {
    const test1 = '{"errors":["Verify code invalid"]}';
    const test2 = '{"errors":[]}';
    const test3 = '{xcasdf}sdfasdf';
    const test4 = 'xxx';
    expect(parseErr(test1)).toEqual(['Verify code invalid']);
    expect(parseErr(test2)).toEqual([]);
    expect(parseErr(test3)).toEqual(false);
    expect(parseErr(test4)).toEqual(false);
  });

  it('tryKey', () => {
    let test;
    const obj = { a: 0, b: { x: 1, y: { z: 2 } } };
    expect(tryKey(test, 'b', 'x')).toEqual(undefined);
    expect(tryKey(obj, 'b', 'x')).toEqual(1);
    expect(tryKey(obj, 'b', 'y', 'z')).toEqual(2);
    expect(tryKey(obj, 'b', 'r', 'z')).toEqual(undefined);
  });
});
