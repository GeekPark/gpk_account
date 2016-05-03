import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Header from '../share/Header';
import LeftMenu from './LeftMenu';

const permitProps = props => ({
  server: props.server,
  dispatch: props.dispatch,
  verify_code: props.verify_code,
});

const Wrapper = props => (
  <div>
    <Header />
    <div className="user-wrapper">
      <div className="left-menu-wrapper">
        <LeftMenu {...permitProps(props)} />
      </div>
      <div className="main-panel-wrapper">
        {React.cloneElement(props.children, { ...permitProps(props) })}
      </div>
    </div>
  </div>
);


Wrapper.propTypes = {
  children: PropTypes.element.isRequired,
  style: PropTypes.object,
};

const mapStateToProps = state => {
  const { server, verify_code } = state;
  return { server, verify_code };
};
export default connect(mapStateToProps)(Wrapper);
