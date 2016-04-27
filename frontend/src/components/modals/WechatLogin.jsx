import React, { PropTypes } from 'react';
import { initWechatLogin } from '../../share/server';

class WechatLogin extends React.Component {
  componentDidMount() {
    initWechatLogin();
  }
  render() {
    return (
      <div>
        <div className="modal-title">
          微信登录
        </div>
        <i className="iconfont icon-close modal-close" onClick={this.props.onClose}></i>
        <div id="wechatQR" className="wechatqr-wrapper"></div>
        <p className="tac">请在微信中扫码登录</p>
      </div>
    );
  }
}

WechatLogin.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default WechatLogin;
