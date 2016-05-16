import 'babel-polyfill';
import { render } from './share/utils';

import User from './components/users/Index';

$(() => {
  render(User, document.querySelector('#component-user'));
});
