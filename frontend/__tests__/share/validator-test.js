jest.unmock('../../src/share/validator');

import { isPhoneNumber, isNotEmpty } from '../../src/share/validator';

describe('validator', () => {
  it('should validate isPhoneNumber', () => {
    expect(isPhoneNumber('123')).toEqual(false);
    expect(isPhoneNumber('abc')).toEqual(false);
    expect(isPhoneNumber('')).toEqual(false);
    expect(isPhoneNumber('15210001111')).toEqual(true);
  });

  it('validate isNotEmpty', () => {
    expect(isNotEmpty('')).toEqual(false);
    expect(isNotEmpty()).toEqual(false);
    expect(isNotEmpty('123')).toEqual(true);
  });
});
