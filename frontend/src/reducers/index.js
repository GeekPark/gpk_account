import { combineReducers } from 'redux';

import modal from './modal';
import user from './user';
import verifyCode from './verify_code';

export default combineReducers({
  modal,
  user,
  verify_code: verifyCode,
});
