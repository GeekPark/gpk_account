import React from 'react';
import { Link } from 'react-router';

import SocialLogin from './SocialLogin';

import { isEmpty } from '../../share/validator';
import { login } from '../../share/server';

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


    this.submit = () => {
      if (!this.check()) return;

      login({
        id: this.refs.loginName.value,
        password: this.refs.password.value,
      }).done(d => {
        console.info(d);
      }).fail(xhr => {
        console.error(xhr);
      });
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
      <div className="form-wrapper">
        <Tooltip info={tooltips.loginName} className="mb-input">
          <input type="text" placeholder="手机号码/邮箱" autoFocus ref="loginName" onChange={this.clearTip('loginName')} />
        </Tooltip>
        <Tooltip info={tooltips.password} className="mb-input">
          <input type="password" placeholder="密码" ref="password" />
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
      </div>
    );
  }
}

export default Login;
