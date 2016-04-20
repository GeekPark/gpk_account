import React from 'react';
import { Link } from 'react-router';

class Header extends React.Component {
  render() {
    return (
      <div className="header-wrapper">
        <div className="logo-wrapper">
          <a href="//www.geekpark.net" className="logo"></a>
          <div className="slogan">创新者的大本营</div>
        </div>
        <div className="switch-button">
          <Link to="login" activeClassName="active">登陆</Link>
          <Link to="signup" activeClassName="active">注册</Link>
        </div>
      </div>
    );
  }
}

export default Header;
