import { UPDATE_USER } from '../actions';

const before = {
  isEmail: false,
  id: '',
};

export default function user(state = before, action) {
  switch (action.type) {
    case UPDATE_USER:
      return { ...state, ...action.user };
    default:
      return state;
  }
}
