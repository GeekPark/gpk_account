export function isPhoneNumber(str) {
  return /^1\d{10}/.test(str);
}

export function isNotEmpty(str) {
  return (typeof str !== 'undefined') && str.length > 0;
}

export function isEmail(str) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(str);
}
