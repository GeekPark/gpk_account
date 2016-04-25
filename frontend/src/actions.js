// action types
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const UPDATE_USER = 'UPDATE_USER';

// actionCreators
export function openModal(modalName, modalStyle) {
  return { type: OPEN_MODAL, modalName, modalStyle };
}

export function closeModal() {
  return { type: CLOSE_MODAL };
}

export function updateUser(user) {
  return { type: UPDATE_USER, user };
}
