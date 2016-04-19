import React from 'react';
import { Link } from 'react-router';

class Header extends React.Component {
  render() {
    return (
      <div className="header-wrapper">
        <div className="logo-wrapper">
          <a href="//www.geekpark.net" className="logo"></a>
          <div className="slogan">发现产品的价值</div>
        </div>
        <div className="switch-button">
          <Link to="login" className="login">登陆</Link>
          <Link to="register" className="register">注册</Link>
        </div>
      </div>
    );
  }
}

export default Header;
