import { OPEN_MODAL, CLOSE_MODAL } from '../actions';

const defaultState = {
  isOpen: false,
  children: null,
};

function modal(state = defaultState, action) {
  switch (action.type) {
    case OPEN_MODAL:
      return { ...state, isOpen: true, children: action.children };
    case CLOSE_MODAL:
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

export default modal;
