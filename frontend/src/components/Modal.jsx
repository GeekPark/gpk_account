import React, { PropTypes } from 'react';
import ReactModal from 'react-modal';

import ValidatorIMG from './modals/ValidatorIMG';
import Default from './modals/Default';

const components = {
  ValidatorIMG,
  Default,
};


class Modal extends React.Component {
  render() {
    const { isOpen, modalName } = this.props;
    const Comp = components[modalName];
    console.log(this.props);
    return (
      <div>
        <ReactModal isOpen={isOpen}>
          <Comp />
        </ReactModal>
      </div>
    );
  }
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  modalName: PropTypes.string.isRequired,
};

export default Modal;
