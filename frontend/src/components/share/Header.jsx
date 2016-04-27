import React from 'react';

class Header extends React.Component {
  render() {
    return (
      <div className="page-header">
        <a href="http://geekpark.net" className="dib-middle logo hover-link"></a>
        <div className="dib-middle split"></div>
        <a href="/" className="dib-middle account-home hover-link">帐号中心</a>
      </div>
    );
  }
}

export default Header;
