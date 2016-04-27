import React from 'react';
import { Link } from 'react-router';

import SocialLogin from './SocialLogin';

import { isEmpty } from '../../share/validator';
import { getCSRFToken } from '../../share/utils';

import Tooltip from '../Tooltip';
import { initState, postErr, clearAllTip, hideTip } from '../../share/tooltip';

const TOOLTIPS = ['loginName', 'password'];

class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      ...initState(TOOLTIPS),
    };

    this.postErr = postErr.bind(this);
    this.clearAllTip = clearAllTip.bind(this);
    this.hideTip = hideTip.bind(this);
    this.clearTip = tipName => this.hideTip.bind(this, tipName);


    this.submit = e => {
      if (!this.check()) e.preventDefault();
    };
  }

  check() {
    const { loginName, password } = this.refs;
    if (isEmpty(loginName.value)) {
      this.postErr('loginName', '用户名不能为空');
      return false;
    }
    if (isEmpty(password.value)) {
      this.postErr('password', '密码不能为空');
      return false;
    }
    return true;
  }

  render() {
    const { tooltips } = this.state;
    return (
      <form className="form-wrapper" action="/login" method="POST">
        <input type="hidden" className="hidden" name="authenticity_token" value={getCSRFToken()} />
        <Tooltip info={tooltips.loginName} className="mb-input">
          <input type="text" name="login_name" placeholder="手机号码/邮箱" autoFocus ref="loginName" onChange={this.clearTip('loginName')} />
        </Tooltip>
        <Tooltip info={tooltips.password} className="mb-input">
          <input type="password" placeholder="密码" ref="password" name="password" />
        </Tooltip>
        <button className="btn btn-large" onClick={this.submit}>立即登录</button>
        <div className="space-between extra-info">
          <div className="rember-me">
            <input type="checkbox" id="rember-me-check" />
            <label htmlFor="rember-me-check" className="cursor-pointer">记住我</label>
          </div>
          <Link className="link" to="reset">忘记密码？</Link>
        </div>
        <SocialLogin {...this.props} />
      </form>
    );
  }
}

export default Login;
