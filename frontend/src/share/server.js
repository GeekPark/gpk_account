import $ from 'jquery';

export function validateCaptcha({ str, user }) {
  return $.ajax({
    url: '/send_verify_code',
    data: {
      _rucaptcha: str,
      user,
    },
  });
}

export function createUser({ verify_code, user }) {
  return $.ajax({
    url: '/signup',
    method: 'POST',
    data: {
      verify_code,
      user,
    },
  });
}
