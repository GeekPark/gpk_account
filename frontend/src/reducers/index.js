import { combineReducers } from 'redux';

import modal from './modal';
import user from './user';
import message from './message';
import verifyCode from './verify_code';

export default combineReducers({
  user,
  modal,
  message,
  verify_code: verifyCode,
});
