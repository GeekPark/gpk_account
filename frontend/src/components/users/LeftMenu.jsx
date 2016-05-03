import React, { PropTypes } from 'react';

import Avatar from '../share/Avatar';

class LeftMenu extends React.Component {
  render() {
    const { server } = this.props;
    const { nickname } = server.user;
    return (
      <div className="left-menu">
        <section className="section basic-userinfo mb-bottom">
          <div className="avatar-wrapper">
            <Avatar />
          </div>
          <div className="nickname">
            {nickname}
          </div>
        </section>
        <section className="section menu-items no-padding">
          <a href="javascript:;">基本资料</a>
          <a className="active" href="javascript:;">账户安全</a>
          <a href="javascript:;">第三方账号</a>
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
