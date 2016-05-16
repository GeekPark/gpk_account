import React from 'react';
import clickAtOutside from 'click-at-outside';
import { isMobileView } from 'mdetect';

import Avatar from './Avatar';

const IS_MOBILE = isMobileView();

class Header extends React.Component {
  dropmenu() {
    if (!IS_MOBILE) return;
    const $dom = $('#dropmenu');
    $dom.addClass('active');
    $('body').css('cursor', 'pointer');

    const cancle = clickAtOutside(
      $dom.get(0),
      () => {
        $dom.removeClass('active');
        cancle();
      }
    );
  }
  render() {
    return (
      <div className="component-header">
        <div className="logo-container">
          <a href="http://www.geekpark.net" className="dib-middle logo hover-link"></a>
          <div className="dib-middle split"></div>
          <a href="/" className="dib-middle account-home hover-link">帐号中心</a>
        </div>
        <div className="dropdown-side" onClick={this.dropmenu} id="dropmenu">
          <Avatar size={35} />
          <div className="dropdown">
            <a href="/">帐号中心</a>
            <a href="/logout" data-method="delete">退出登录</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
