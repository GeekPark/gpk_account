import React from 'react';
import SocialLogin from './SocialLogin';

class Register extends React.Component {
  render() {
    return (
      <div className="form-wrapper">
        <input type="text" autoFocus placeholder="手机号码（仅支持中国大陆）" />
        <div className="form-group">
          <input type="password" placeholder="密码" />
          <div className="form-side">
            <div className="iconfont icon-eye"></div>
          </div>
        </div>
        <div className="form-group">
          <input type="text" placeholder="邮箱验证码" />
          <div className="form-side">
            获取验证码
          </div>
        </div>
        <button className="btn btn-large btn-blue">立即注册</button>
        <div className="tar extra-info">
          <a className="link" href="javascript:;">使用邮箱注册</a>
        </div>
        <SocialLogin />
      </div>
    );
  }
}

export default Register;
