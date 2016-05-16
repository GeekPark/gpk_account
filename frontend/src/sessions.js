import 'babel-polyfill';
import { render } from './share/utils';

import Session from './components/sessions/Index';

$(() => {
  render(Session, document.querySelector('#component-session'));
});
