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
            通过第三方帐号登录
          </span>
        </div>
        <div className="social-button">
          <a className="social-button-style wechat" href="javascript:;" onClick={this.wechat}>
            <i className="iconfont icon-wechat social-icon"></i>
            <span>微信登陆</span>
          </a>
          <a className="social-button-style weibo" href="/auth/weibo">
            <i className="iconfont icon-weibo social-icon"></i>
            <span>微博登陆</span>
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
