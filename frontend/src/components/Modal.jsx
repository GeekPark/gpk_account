import React, { PropTypes } from 'react';
import ReactModal from 'react-modal';
import deepAssign from 'deep-assign';
import { connect } from 'react-redux';

import ValidatorIMG from './modals/ValidatorIMG';
import WechatLogin from './modals/WechatLogin';
import Default from './modals/Default';
import { closeModal, sendVerifyCode, validateUser } from '../actions';

const components = {
  ValidatorIMG,
  WechatLogin,
  Default,
};

const defaultStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
};

class Modal extends React.Component {
  render() {
    const { isOpen, modalName, modalStyle } = this.props.modal;
    const Comp = components[modalName];
    const style = deepAssign(defaultStyles, modalStyle);
    return (
      <ReactModal isOpen={isOpen} style={style} className={`modal-${modalName}`}>
        <Comp {...this.props} />
      </ReactModal>
    );
  }
}

Modal.propTypes = {
  modal: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(closeModal()),
  sendVerifyCode: () => dispatch(sendVerifyCode()),
  validateUser: () => dispatch(validateUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
