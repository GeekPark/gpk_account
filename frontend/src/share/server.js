import $ from 'jquery';
import { parseErr } from './utils';

export function sendVerify({ str, id, isEmail }) {
  const param = {};
  if (isEmail) param.email = id;
  else param.mobile = id;

  return $.ajax({
    url: '/send_verify_code',
    method: 'POST',
    data: {
      _rucaptcha: str,
      type: isEmail ? 'email' : 'mobile',
      ...param,
    },
  });
}

export function sendVerifyWithoutCaptcha({ type, params }) {
  return $.ajax({
    url: '/send_verify_code',
    method: 'POST',
    data: { type, ...params },
  });
}

export function createUser({ user }) {
  return $.ajax({
    url: '/signup',
    method: 'POST',
    data: {
      user,
    },
  });
}

export function initWechatLogin() {
  return new WxLogin({
    id: 'wechatQR',
    appid: 'wxd469c54993b2a659',
    scope: 'snsapi_login',
    redirect_uri: `${location.origin}/auth/wechat/callback`,
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

// user: { email/mobile, password, verify_code: xxxxxx }
export function resetPassword({ user }) {
  return $.ajax({
    url: '/reset_password',
    method: 'POST',
    data: {
      user,
    },
  });
}

// resolve when user DOESN'T EXIST
// reject when user EXIST
export function notExist(id) {
  return new Promise((res, rej) => {
    $.ajax({
      url: '/check_exist',
      data: {
        user: { email: id },
      },
    }).done(d => {
      if (d.exist) {
        rej(d);
      } else {
        res(d);
      }
    }).fail(xhr => {
      const msg = parseErr(xhr.responseText);
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

export function isIdentified() {
  return new Promise((res, rej) => {
    $.ajax({
      url: '/settings/identified',
    }).done(d => {
      if (d.identified) res();
      else rej();
    }).fail(xhr => {
      const msg = parseErr(xhr.responseText);
      console.error(msg);
      rej();
    });
  });
}

export function verifyCurrentUser({ verify_code, type }) {
  return $.ajax({
    url: '/settings/verify_current_user',
    method: 'POST',
    data: { verify_code, type },
  });
}

export function updateID({ type, id, verify_code, password }) {
  return $.ajax({
    url: '/settings/update_primary',
    method: 'PATCH',
    data: { verify_code, type, [type]: id, password },
  });
}

export function bindAccount(type) {
  window.location.href = `${window.location.origin}/auth/${type}`;
}

export function unbindAccount(type) {
  return $.ajax({
    url: `/auth/${type}/unbind`,
    method: 'DELETE',
  });
}

export function get2FAQR() {
  return new Promise((res, rej) => {
    $.ajax({
      url: '/settings/two_factor_qr',
    }).done(d => {
      if (d.qr_code) res(d.qr_code);
      else rej();
    }).error(() => rej());
  });
}

export function bind2FA(otp_code) {
  const data = {};
  if (otp_code !== undefined) data.otp_code = otp_code;

  return $.ajax({
    url: '/settings/two_factor',
    method: 'POST',
    data,
  });
}

export function unbind2FA() {
  return bind2FA(undefined);
}

export function updateEmailPreference({ preference }) {
  return $.ajax({
    url: '/settings/update_preference',
    method: 'PATCH',
    data: {
      user: { preference },
    },
  });
}

export function searchOrigin({ type, key }) {
  const urls = {
    activity: 'http://events.geekpark.net/api/v1/activities',
    topic: 'http://www.geekpark.net/api/v1/topics',
  };

  return new Promise((res, rej) => {
    const url = `${urls[type]}/auto_complete/${key}.json`;

    $.ajax(url)
      .done(d => {
        const list = d.activities || d.topics;
        res(list.map(x => ({ text: x.label, value: x.value })));
      })
      .fail(jqXHR => {
        rej(jqXHR);
      });
  });
}
