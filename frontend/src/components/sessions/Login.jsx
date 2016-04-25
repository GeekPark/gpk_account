import React from 'react';
import { Link } from 'react-router';

import SocialLogin from './SocialLogin';

class Login extends React.Component {
  render() {
    return (
      <div className="form-wrapper">
        <input type="text" placeholder="手机号码/邮箱" autoFocus className="mb-input" />
        <input type="password" placeholder="密码" className="mb-input" />
        <button className="btn btn-large">立即登录</button>
        <div className="space-between extra-info">
          <div className="rember-me">
            <input type="checkbox" id="rember-me-check" />
            <label htmlFor="rember-me-check" className="cursor-pointer">记住我</label>
          </div>
          <Link className="link" to="reset">忘记密码？</Link>
        </div>
        <SocialLogin />
      </div>
    );
  }
}

export default Login;
