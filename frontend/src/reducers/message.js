import { SHOW_MESSAGE, CLOSE_MESSAGE } from '../actions';

const defaultState = {
  isShow: false,
  msgType: 'success',
  msg: '',
};

export default function message(state = defaultState, action) {
  const { msgType, msg, type } = action;
  switch (type) {
    case SHOW_MESSAGE:
      return { isShow: true, msgType, msg };
    case CLOSE_MESSAGE:
      return { ...state, isShow: false };
    default:
      return state;
  }
}
