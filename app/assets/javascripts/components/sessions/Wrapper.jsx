import React, { PropTypes } from 'react';

import Header from './Header.jsx';

class Wrapper extends React.Component {
  render() {
    return (
      <div className="page-container">
        <Header />
        {this.props.children}
      </div>
    );
  }
}

Wrapper.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Wrapper;
