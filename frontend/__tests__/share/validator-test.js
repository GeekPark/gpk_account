jest.unmock('../../src/share/validator');

import {
  isPhoneNumber, isEmpty, isNotEmpty, isEmail, isValidNickname,
  isValidPassword, isValidID, isValidVerifyCode, isValidBirthday,
} from '../../src/share/validator';

describe('validator', () => {
  it('should validate isPhoneNumber', () => {
    expect(isPhoneNumber('123')).toEqual(false);
    expect(isPhoneNumber('abc')).toEqual(false);
    expect(isPhoneNumber('')).toEqual(false);
    expect(isPhoneNumber('15210001111')).toEqual(true);
    expect(isPhoneNumber('15210001111123')).toEqual(false);
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

  it('isValidNickname', () => {
    expect(isValidNickname('123')).toEqual(true);
    expect(isValidNickname('1')).toEqual(false);
    expect(isValidNickname('12')).toEqual(true);
    expect(isValidNickname('1112312312312312312311231231231232')).toEqual(false);
  });

  it('isValidPassword', () => {
    expect(isValidPassword('123')).toEqual(false);
    expect(isValidPassword('1asdfasdf')).toEqual(true);
    expect(isValidPassword('123456')).toEqual(true);
    expect(isValidPassword('1112312312312312312311231231231232')).toEqual(false);
  });

  it('isValidID', () => {
    expect(isValidID('123')).toEqual(false);
    expect(isValidID('mail@geekpark.net')).toEqual(true);
    expect(isValidID('15210000000')).toEqual(true);
    expect(isValidID('1112312312312312312311231231231232')).toEqual(false);
  });

  it('isValidVerifyCode', () => {
    expect(isValidVerifyCode('123432')).toEqual(true);
    expect(isValidVerifyCode('1a3432')).toEqual(false);
    expect(isValidVerifyCode('1234321')).toEqual(false);
    expect(isValidVerifyCode('')).toEqual(false);
  });

  it('isValidBirthday', () => {
    expect(isValidBirthday('1994-10-20')).toEqual(true);
    expect(isValidBirthday('2017-10-20')).toEqual(false);
    expect(isValidBirthday('1907-10-20')).toEqual(false);
    expect(isValidBirthday('2013-10-201')).toEqual(false);
    expect(isValidBirthday('123123123123')).toEqual(false);
  });
});
