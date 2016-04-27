import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Header from '../share/Header';
import LeftMenu from './LeftMenu';

const Wrapper = props => (
  <div>
    <Header />
    <div className="user-wrapper">
      <div className="left-menu-wrapper">
        <LeftMenu />
      </div>
      <div className="main-panel-wrapper">
        {React.cloneElement(props.children, { ...props })}
      </div>
    </div>
  </div>
);


Wrapper.propTypes = {
  children: PropTypes.element.isRequired,
  style: PropTypes.object,
};

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Wrapper);
