export function isPhoneNumber(str) {
  return /^1\d{10}/.test(str);
}

export function isNotEmpty(str) {
  return (typeof str !== 'undefined') && str.length > 0;
}
