import React from 'react';
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
      const propsStr = dom.getAttribute('data-server');
      const server = propsStr && JSON.parse(propsStr);
      props = { ...props, server };
      dom.removeAttribute('data-server');
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
