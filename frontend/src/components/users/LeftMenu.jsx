import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import Avatar from '../share/Avatar';

class LeftMenu extends React.Component {
  render() {
    const { server } = this.props;
    const { nickname } = server.user;
    return (
      <div className="left-menu">
        <section className="section basic-userinfo mb-bottom padding">
          <div className="avatar-wrapper">
            <Avatar />
          </div>
          <div className="nickname">
            {nickname}
          </div>
        </section>
        <section className="section menu-items no-padding">
          <Link to="/" activeClassName="active">
            <i className="iconfont icon-profile"></i>
            <span className="hidden-xs">
              基本资料
            </span>
          </Link>
          <Link to="security" activeClassName="active">
            <i className="iconfont icon-security"></i>
            <span className="hidden-xs">
              帐户安全
            </span>
          </Link>
          <Link to="third" activeClassName="active">
            <i className="iconfont icon-third"></i>
            <span className="hidden-xs">
              第三方帐号
            </span>
          </Link>
          <Link to="subscribe" activeClassName="active">
            <i className="iconfont icon-email-sub"></i>
            <span className="hidden-xs">
              邮件订阅
            </span>
          </Link>
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
