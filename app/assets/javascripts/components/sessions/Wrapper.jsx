import React, { PropTypes } from 'react';

import Header from './Header.jsx';

class Wrapper extends React.Component {
  render() {
    return (
      <div className="page-container">
        <div className="page-container-style" style={this.props.style}>
          <Header />
          {this.props.children}
        </div>
      </div>
    );
  }
}

Wrapper.propTypes = {
  children: PropTypes.element.isRequired,
  style: PropTypes.object,
};

export default Wrapper;
