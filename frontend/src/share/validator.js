const limitStr = (str, min, max) => str && str.length >= min && str.length <= max;

export function isPhoneNumber(str) {
  return /^1\d{10}$/.test(str);
}

export function isNotEmpty(str) {
  return (typeof str !== 'undefined') && str.length > 0;
}

export function isEmail(str) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(str);
}

export function isEmpty(str) {
  return !isNotEmpty(str);
}

export function isValidNickname(str) {
  return limitStr(str, 2, 20);
}

export function isValidPassword(str) {
  return limitStr(str, 6, 20);
}

export function isValidID(str) {
  return (isPhoneNumber(str) || isEmail(str));
}
