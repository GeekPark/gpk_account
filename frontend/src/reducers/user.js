import { UPDATE_USER, VALIDATE_USER } from '../actions';

const before = {
  isEmail: false,
  id: '',
  isValidated: false,
};

export default function user(state = before, action) {
  switch (action.type) {
    case UPDATE_USER:
      return { ...state, ...action.user };
    case VALIDATE_USER:
      return { ...state, isValidated: true };
    default:
      return state;
  }
}
