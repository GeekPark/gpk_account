import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Header from './Header';
import { permit } from '../../share/utils';

const Wrapper = props => (
  <div>
    <div className="page-container">
      <div className="page-container-style" style={props.style}>
        <Header {...permit(props, ['avatarURL', 'dispatch', 'server'])} />
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
