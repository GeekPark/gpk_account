import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Header from './Header';

const Wrapper = props => (
  <div>
    <div className="page-container">
      <div className="page-container-style" style={props.style}>
        <Header />
        {React.cloneElement(props.children, { dispatch: props.dispatch })}
      </div>
    </div>
  </div>
);

Wrapper.propTypes = {
  children: PropTypes.element.isRequired,
  dispatch: PropTypes.func.isRequired,
  style: PropTypes.object,
};

const mapStateToProps = state => ({ ...state });

export default connect(mapStateToProps)(Wrapper);
