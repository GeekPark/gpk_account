import React, { PropTypes } from 'react';
import ReactModal from 'react-modal';

class Modal extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
    };
  }
  render() {
    return (
      <div>
        <ReactModal
          isOpen={this.state.isOpen}
          {...this.props}
        >
         {this.props.children}
        </ReactModal>
      </div>
    );
  }
}

Modal.defaultProps = {
  children: <div />,
};

Modal.propTypes = {
  children: PropTypes.element,
};

export default Modal;
