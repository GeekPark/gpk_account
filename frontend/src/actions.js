// action types
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

// actionCreators
export function openModal(modalName) {
  return { type: OPEN_MODAL, modalName };
}

export function closeModal() {
  return { type: CLOSE_MODAL };
}
