import React from 'react';

import Avatar from '../share/Avatar';

class LeftMenu extends React.Component {
  render() {
    return (
      <div className="left-menu">
        <section className="section">
          <Avatar editable needhover />
        </section>
      </div>
    );
  }
}

export default LeftMenu;
