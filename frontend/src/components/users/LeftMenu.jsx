import React, { PropTypes } from 'react';

import Avatar from '../share/Avatar';

class LeftMenu extends React.Component {
  render() {
    const { server, dispatch } = this.props;
    let avatarSrc;

    if (server && server.avatar_url) avatarSrc = server.avatar_url;
    return (
      <div className="left-menu">
        <section className="section">
          <Avatar editable needhover src={avatarSrc} dispatch={dispatch} />
        </section>
      </div>
    );
  }
}

LeftMenu.propTypes = {
  server: PropTypes.any,
  dispatch: PropTypes.func.isRequired,
};

export default LeftMenu;
