import { render } from './share/utils';

import Session from './components/sessions/Index';
import User from './components/users/Index';

$(() => {
  render(Session, document.querySelector('#component-session'));
  render(User, document.querySelector('#component-user'));
});
