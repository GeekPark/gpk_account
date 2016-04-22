import React, { PropTypes } from 'react';

import Header from './Header';
import Modal from '../Modal';

const Wrapper = ({ children, style }) => (
  <div>
    <div className="page-container">
      <div className="page-container-style" style={style}>
        <Header />
        {children}
      </div>
    </div>
    <Modal />
  </div>
);

Wrapper.propTypes = {
  children: PropTypes.element.isRequired,
  style: PropTypes.object,
};

export default Wrapper;
