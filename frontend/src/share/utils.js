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
  if (dom) r(Comp, dom);
}
