import React, { PropTypes } from 'react';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.element,
  }

  render() {
    return (
      <div className="layout-wrapper">
      </div>
    );
  }
}

export default Layout;
