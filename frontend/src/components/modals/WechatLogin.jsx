import React, { PropTypes } from 'react';
import { initWechatLogin } from '../../share/server';

class WechatLogin extends React.Component {
  componentDidMount() {
    initWechatLogin();
  }
  render() {
    return (
      <div>
        <i className="iconfont icon-close modal-close" onClick={this.props.onClose}></i>
        <div id="wechatQR" className="wechatqr-wrapper"></div>
      </div>
    );
  }
}

WechatLogin.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default WechatLogin;
