import React from 'react';
import { render } from './share/utils';

import Session from './components/sessions/Index';
import User from './components/users/Index';
import Welcome from './components/welcome/Index';

$(() => {
  render(<Session />, document.querySelector('#component-session'));
  render(<User />, document.querySelector('#component-user'));
  render(<Welcome />, document.querySelector('#component-welcome'));
});
