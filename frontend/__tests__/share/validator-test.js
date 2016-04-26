jest.unmock('../../src/share/validator');

import { isPhoneNumber, isEmpty, isNotEmpty, isEmail } from '../../src/share/validator';

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

  it('validate isEmail', () => {
    expect(isEmail('')).toEqual(false);
    expect(isEmail('test@geekpark.net')).toEqual(true);
    expect(isEmail('test@geekpark.net.cn')).toEqual(true);
    expect(isEmail('123412313@qq.com')).toEqual(true);
    expect(isEmail('123412313qq.com')).toEqual(false);
    expect(isEmail('123412313@qq')).toEqual(false);
  });

  it('isEmpty', () => {
    expect(isEmpty('')).toEqual(true);
    expect(isEmpty()).toEqual(true);
    expect(isEmpty('123')).toEqual(false);
  });
});
