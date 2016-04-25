import { SEND_VERIFY_CODE, RESET_VERIFY_CODE, UPDATE_COUNTDOWN } from '../actions';

const before = {
  isFirst: true,
  pending: false,
  countdown: 0,
};

export default function verifyCode(state = before, action) {
  switch (action.type) {
    case SEND_VERIFY_CODE:
      return { isFirst: false, pending: true, countdown: 60 };
    case RESET_VERIFY_CODE:
      return { isFirst: false, pending: false, countdown: 0 };
    case UPDATE_COUNTDOWN:
      return { ...state, countdown: action.countdown };
    default:
      return state;
  }
}
