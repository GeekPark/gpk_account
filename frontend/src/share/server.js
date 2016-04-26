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

export function login({ id, password }) {
  return $.ajax({
    url: '/login',
    method: 'POST',
    data: {
      login_name: id,
      password,
    },
  });
}

export function initWechatLogin() {
  return new WxLogin({
    id: 'wechatQR',
    appid: 'wxd469c54993b2a659',
    scope: 'snsapi_login',
    redirect_uri: 'http://geekpark.net/users/auth/wechat/callback',
    state: '',
    style: '',
    href: '',
  });
}
