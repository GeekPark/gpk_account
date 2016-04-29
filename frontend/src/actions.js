// action types
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export const UPDATE_USER = 'UPDATE_USER';
export const VALIDATE_USER = 'VALIDATE_USER';

export const SEND_VERIFY_CODE = 'SEND_VERIFY_CODE';
export const RESET_VERIFY_CODE = 'RESET_VERIFY_CODE';
export const UPDATE_COUNTDOWN = 'UPDATE_COUNTDOWN';

export const SHOW_MESSAGE = 'SHOW_MESSAGE';
export const CLOSE_MESSAGE = 'CLOSE_MESSAGE';

export const SET_STORE = 'SET_STORE';

// actionCreators
export function openModal(modalName, modalStyle) {
  return { type: OPEN_MODAL, modalName, modalStyle };
}

export function closeModal() {
  return { type: CLOSE_MODAL };
}

// user
export function updateUser(user) {
  return { type: UPDATE_USER, user };
}

export function validateUser() {
  return { type: VALIDATE_USER };
}

// verifyCode
const resendVerifyCode = () => ({ type: SEND_VERIFY_CODE });
const updateCountdown = s => ({ type: UPDATE_COUNTDOWN, countdown: s });

export function resetVerify() {
  return { type: RESET_VERIFY_CODE };
}

export function sendVerifyCode() {
  return dispatch => {
    dispatch(resendVerifyCode());

    let counter = 1;
    const id = window.setInterval(() => {
      if (counter === 60) window.clearInterval(id);
      dispatch(updateCountdown((60 - counter++)));
    }, 1000);
  };
}

// message
const showMessagePart = ({ msgType, msg }) => ({ type: SHOW_MESSAGE, msgType, msg });

export const clearMessage = () => ({ type: CLOSE_MESSAGE });

let timeoutID;

export function showMessage({ type, msg }) {
  return dispatch => {
    clearTimeout(timeoutID);
    dispatch(clearMessage());
    setTimeout(() => {
      dispatch(showMessagePart({ msgType: type, msg }));
    }, 300);

    timeoutID = setTimeout(() => {
      dispatch(clearMessage());
    }, 1000 * 5);
  };
}

// server store
export function setStore(data) {
  return { type: SET_STORE, data };
}
