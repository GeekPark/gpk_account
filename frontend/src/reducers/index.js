import { combineReducers } from 'redux';

import modal from './modal';
import user from './user';
import server from './server';
import message from './message';
import verifyCode from './verify_code';

export default combineReducers({
  user,
  modal,
  message,
  server,
  verify_code: verifyCode,
});
