// action types
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export const UPDATE_USER = 'UPDATE_USER';
export const VALIDATE_USER = 'VALIDATE_USER';

export const SEND_VERIFY_CODE = 'SEND_VERIFY_CODE';
export const RESET_VERIFY_CODE = 'RESET_VERIFY_CODE';
export const UPDATE_COUNTDOWN = 'UPDATE_COUNTDOWN';

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

export function validateUser() {
  return { type: VALIDATE_USER };
}

const resendVerifyCode = () => ({ type: SEND_VERIFY_CODE });
const resetVerfiyCode = () => ({ type: RESET_VERIFY_CODE });
const updateCountdown = s => ({ type: UPDATE_COUNTDOWN, countdown: s });

export function sendVerifyCode() {
  return dispatch => {
    dispatch(resendVerifyCode());

    let counter = 1;
    const id = window.setInterval(() => {
      if (counter === 60) {
        dispatch(resetVerfiyCode());
        window.clearInterval(id);
      }
      dispatch(updateCountdown((60 - counter++)));
    }, 1000);
  };
}
