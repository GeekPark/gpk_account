import React from 'react';
import SocialLogin from './SocialLogin';

class Login extends React.Component {
  render() {
    return (
      <div className="login-form">
        <input type="text" placeholder="手机号码/邮箱" autoFocus />
        <input type="password" placeholder="密码" />
        <button className="btn btn-large btn-blue">立即登陆</button>
        <div className="space-between extra-info">
          <div className="rember-me">
            <input type="checkbox" id="rember-me-check" />
            <label htmlFor="rember-me-check" className="cursor-pointer">记住我</label>
          </div>
          <a className="link" href="javascript:;">忘记密码？</a>
        </div>
        <SocialLogin />
      </div>
    );
  }
}

export default Login;
