import { render } from './share/utils';

import Session from './components/sessions/Index';
import User from './components/users/Index';
// import Welcome from './components/welcome/Index';

$(() => {
  render(Session, document.querySelector('#component-session'));
  render(User, document.querySelector('#component-user'));
  // mock data
  // render(Welcome, document.querySelector('#component-session'), {
  //   data: {
  //     user: {
  //       id: '19c942fe-5f0e-4569-83fb-0c8bd1fa7ee3',
  //       email: null,
  //       nickname: null,
  //       mobile: '10007987979',
  //       city: null,
  //       avatar: null,
  //       company: null,
  //       title: null,
  //       bio: null,
  //     },
  //     callback_url: 'http://lh:8080/',
  //   },
  // });
});
