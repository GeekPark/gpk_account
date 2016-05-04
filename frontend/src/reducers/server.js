import { SET_STORE } from '../actions';

const defaultState = {};

export default function modal(state = defaultState, action) {
  switch (action.type) {
    case SET_STORE:
      return { ...state, ...action.data };
    default:
      return state;
  }
}
