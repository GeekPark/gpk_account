import React, { PropTypes } from 'react';

import Avatar from '../share/Avatar';

class LeftMenu extends React.Component {
  render() {
    const { server, dispatch } = this.props;
    const { avatar_url, nickname } = server.user;
    return (
      <div className="left-menu">
        <section className="section basic-userinfo">
          <div className="avatar-wrapper">
            <Avatar editable needhover src={avatar_url} dispatch={dispatch} />
          </div>
          <div className="nickname">
            {nickname}
          </div>
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
