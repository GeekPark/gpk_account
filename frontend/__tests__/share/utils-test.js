jest.unmock('../../src/share/utils');

import { parseErr } from '../../src/share/utils';

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
});
