import React from 'react';
import { Link } from 'react-router';

class Header extends React.Component {
  render() {
    return (
      <div className="header-wrapper">
        <div className="logo-wrapper">
          <a href="//www.geekpark.net" className="logo"></a>
        </div>
        <div className="form-wrapper switch-button">
          <Link to="login" activeClassName="active">登录</Link>
          <Link to="signup" activeClassName="active">注册</Link>
        </div>
      </div>
    );
  }
}

export default Header;
