import React from 'react';

class SocialLogin extends React.Component {
  render() {
    return (
      <div className="social-login">
        <div className="section-title">
          <span>
            通过第三方账号登陆
          </span>
        </div>
        <div className="space-around social-button">
          <a href="javascript:;">
            <i className="iconfont icon-weibo social-icon"></i>
          </a>
          <a href="javascript:;">
            <i className="iconfont icon-wechat social-icon"></i>
          </a>
        </div>
      </div>
    );
  }
}

export default SocialLogin;
