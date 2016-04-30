import React from 'react';
import { Link } from 'react-router';

import SocialLogin from './SocialLogin';

import { isEmpty, isValidID, isValidPassword } from '../../share/validator';
import { getCSRFToken } from '../../share/utils';

import Tooltip from '../share/Tooltip';

class Login extends React.Component {
  constructor() {
    super();

    this.submit = e => {
      if (!this.check()) e.preventDefault();
    };

    this.clearTip = tipName => () => this.refs[tipName].clear();
  }

  check() {
    const { loginName, password, loginNameTip, passwordTip } = this.refs;
    if (isEmpty(loginName.value)) {
      loginNameTip.postErr('用户名不能为空');
      return false;
    }
    if (!isValidID(loginName.value)) {
      loginNameTip.postErr('用户名必须为邮箱或手机号');
      return false;
    }
    if (isEmpty(password.value)) {
      passwordTip.postErr('密码不能为空');
      return false;
    }
    if (!isValidPassword(password.value)) {
      passwordTip.postErr('密码格式不对');
      return false;
    }
    return true;
  }

  render() {
    return (
      <form className="form-wrapper" action="/login" method="POST">
        <input type="hidden" className="hidden" name="authenticity_token" value={getCSRFToken()} />
        <Tooltip className="mb-input" ref="loginNameTip">
          <input type="text" name="login_name" placeholder="手机号码/邮箱" autoFocus ref="loginName" onChange={this.clearTip('loginNameTip')} />
        </Tooltip>
        <Tooltip className="mb-input" ref="passwordTip">
          <input type="password" placeholder="密码" ref="password" name="password" onChange={this.clearTip('passwordTip')} />
        </Tooltip>
        <button className="btn btn-large" onClick={this.submit}>立即登录</button>
        <div className="space-between extra-info">
          <div className="rember-me">
            <input type="checkbox" id="rember-me-check" name="remember_me" />
            <label htmlFor="rember-me-check" className="cursor-pointer">记住我</label>
          </div>
          <Link className="link" to="reset_password">忘记密码？</Link>
        </div>
        <SocialLogin {...this.props} />
      </form>
    );
  }
}

export default Login;
