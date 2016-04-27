import React from 'react';
import { render as r } from 'react-dom';

export function parseErr(str) {
  let err;
  try {
    err = JSON.parse(str).errors;
  } catch (e) {
    console.error(e);
    err = false;
  }
  return err;
}

export function render(Comp, dom) {
  if (dom) {
    let props;
    try {
      const propsStr = dom.getAttribute('data-server');
      const server = propsStr && JSON.parse(propsStr);
      props = { server };
    } catch (err) {
      props = {};
      console.error('server store parse error: ', err);
    }
    r(React.createElement(Comp, props), dom);
  }
}

export function getCSRFToken() {
  return document.querySelector('meta[name=csrf-token]').content;
}
