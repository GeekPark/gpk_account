import { OPEN_MODAL, CLOSE_MODAL } from '../actions';

const defaultState = {
  isOpen: false,
  modalName: 'Default',
};

export default function modal(state = defaultState, action) {
  switch (action.type) {
    case OPEN_MODAL:
      return { ...state, isOpen: true, modalName: action.modalName };
    case CLOSE_MODAL:
      return { ...state, isOpen: false };
    default:
      return state;
  }
}
