import $ from 'jquery';
import { parseErr } from './utils';

export function sendVerify({ str, user, isEmail }) {
  return $.ajax({
    url: isEmail ? '/verify_email' : '/verify_mobile',
    method: 'POST',
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

export function initWechatLogin() {
  return new WxLogin({
    id: 'wechatQR',
    appid: 'wxd469c54993b2a659',
    scope: 'snsapi_login',
    redirect_uri: `http://${location.hostname}/auth/wechat/callback`,
    state: '',
    style: '',
    href: '',
  });
}

export function updateUser(data) {
  return $.ajax({
    url: '/my',
    method: 'PATCH',
    data,
  });
}

export function uploadAvatar(data) {
  return $.ajax({
    url: '/my',
    method: 'PATCH',
    catch: false,
    processData: false,
    contentType: false,
    data,
  });
}

// user: { email/mobile, password }, verify_code: xxxxxx
export function resetPassword({ verify_code, user }) {
  return $.ajax({
    url: '/reset_password',
    method: 'POST',
    data: {
      verify_code,
      user,
    },
  });
}

// resolve when user DOESN'T EXIST
// reject when user EXIST
export function checkExist(id) {
  return new Promise((res, rej) => {
    $.ajax({
      url: '/check_exist',
      data: {
        user: { email: id },
      },
    }).done(d => {
      if (d.exist) {
        rej('用户已存在');
      } else {
        res(d);
      }
    }).fail(xhr => {
      const msg = parseErr(xhr);
      if (msg) rej(msg);
    });
  });
}

export function updatePassword({ password, new_password }) {
  return $.ajax({
    url: '/settings/update_password',
    method: 'PATCH',
    data: {
      password,
      new_password,
    },
  });
}
