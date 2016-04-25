// action types
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export const UPDATE_USER = 'UPDATE_USER';

export const SEND_VERIFY_CODE = 'SEND_VERIFY_CODE';
export const RESET_VERIFY_CODE = 'RESET_VERIFY_CODE';

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

const resendVerifyCode = () => ({ type: SEND_VERIFY_CODE });
const resetVerfiyCode = () => ({ type: RESET_VERIFY_CODE });

export function sendVerifyCode() {
  return dispatch => {
    dispatch(resendVerifyCode());

    setTimeout(() => {
      dispatch(resetVerfiyCode());
    }, 60 * 1000);
  };
}
