import $ from 'jquery';
import React from 'react';
import { isMobileView } from 'mdetect';
import { render as r } from 'react-dom';
import { showMessage } from '../actions';

export function parseErr(str) {
  let err;
  try {
    err = JSON.parse(str).errors[0];
  } catch (e) {
    console.error(e);
    err = false;
  }
  return err;
}

export function render(Comp, dom, initProps = {}) {
  if (dom) {
    let props = initProps;
    try {
      const $server = document.getElementById('server-data');
      const serverData = $server.getAttribute('data-server');
      const server = serverData && JSON.parse(serverData);
      props = { ...props, server };
      document.body.removeChild($server);
    } catch (err) {
      console.error('react server data parse error: ', err);
    }
    r(React.createElement(Comp, props), dom);
  }
}

export function getCSRFToken() {
  return document.querySelector('meta[name=csrf-token]').content;
}

export function tryKey(obj, ...keys) {
  return keys.reduce((pre, current) => {
    if (pre) return pre[current];
    else return undefined;
  }, obj);
}

export function showXHRError(xhr, dispatch) {
  const msg = parseErr(xhr.responseText);
  if (msg) dispatch(showMessage({ type: 'error', msg }));
  else console.error(`Can't parse error: ${xhr}`);
}

export function isSNS(user) {
  return user.email === null && user.mobile === null;
}

export function focus(dom) {
  if (!isMobileView() && dom instanceof Element) dom.focus();
}

export function changeTitle(str) {
  $('title').text($('title').text().replace(/^[^\s]*\s/, `${str} `));
}

export function permit(props, keys) {
  const result = {};

  keys.forEach(key => {
    if (props[key] !== undefined) result[key] = props[key];
  });

  return result;
}
