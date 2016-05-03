import React, { PropTypes } from 'react';
import { Link } from 'react-router';

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
          <Link to="/" activeClassName="active">基本资料</Link>
          <Link to="security" activeClassName="active">账户安全</Link>
          <Link to="third" activeClassName="active">第三方账号</Link>
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
