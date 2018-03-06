import React, { PropTypes } from 'react';
import { isWechat, isMobileUA } from 'mdetect';
import { openModal } from '../../actions';
import intl from 'react-intl-universal';

class SocialLogin extends React.Component {
  constructor() {
    super();

    this.wechat = () => {
      if (isWechat()) {
        window.location.href = '/auth/wechatservice';
      } else {
        this.props.dispatch(openModal('WechatLogin'));
      }
    };
  }

  render() {
    const wechatContent = isWechat() || !isMobileUA() ? <a className="social-button-style wechat" href="javascript:;" onClick={this.wechat}>
      <i className="iconfont icon-wechat social-icon"></i>
      <span>{intl.get('微信登录')}</span>
    </a> : '';

    return (
      <div className="social-login">
        <div className="section-title">
          <span>{intl.get('通过第三方帐号登录')}</span>
        </div>
        <div className={`social-button ${isWechat() || !isMobileUA() ? '' : 'center'}`}>
          {wechatContent}
          <a className="social-button-style weibo" href="/auth/weibo">
            <i className="iconfont icon-weibo social-icon"></i>
            <span>微博登录</span>
          </a>
        </div>
        {!wechatContent && <div className="tal" style={{color: '#777', marginTop: '50px'}}>{intl.get('手机浏览器内暂不支持微信登录，请前往桌面端登录或复制链接在微信内打开。')}</div>}
      </div>
    );
  }
}

SocialLogin.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default SocialLogin;
