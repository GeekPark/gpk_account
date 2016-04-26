import React, { PropTypes } from 'react';
import { openModal } from '../../actions';

class SocialLogin extends React.Component {
  constructor() {
    super();

    this.wechat = () => {
      this.props.dispatch(openModal('WechatLogin'));
    };
  }

  render() {
    return (
      <div className="social-login">
        <div className="section-title">
          <span>
            通过第三方账号登录
          </span>
        </div>
        <div className="space-around social-button">
          <a href="javascript:;" onClick={this.weibo}>
            <i className="iconfont icon-weibo social-icon"></i>
          </a>
        </div>
      </div>
    );
  }
}

SocialLogin.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default SocialLogin;
