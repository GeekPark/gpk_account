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
