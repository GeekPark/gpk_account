import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import SocialLogin from './SocialLogin';

import { isEmpty, isValidID, isValidPassword } from '../../share/validator';
import { getCSRFToken, changeTitle } from '../../share/utils';

import Tooltip from '../share/Tooltip';

import { changeAvatar } from '../../actions';
import { notExist } from '../../share/server';
import intl from 'react-intl-universal';

class Login extends React.Component {
  constructor() {
    super();

    this.submit = e => {
      if (this.checkID() === false || this.checkPassword() === false) {
        e.preventDefault();
        return;
      }
      this.refs.loginBtn.innerText = intl.get('登录中') + '...';
    };

    this.clearTip = tipName => () => this.refs[tipName].clear();

    this.onIDBlur = e => {
      if (e.target.value < 2) {
        this.props.dispatch(changeAvatar(null));
        return;
      }
      const v = this.checkID();
      if (v === false) {
        this.props.dispatch(changeAvatar(null));
        return;
      }
      notExist(v)
        .then(() => {
          this.refs.loginNameTip.postErr(intl.get('用户不存在'));
          this.props.dispatch(changeAvatar(null));
        })
        .catch(d => {
          this.props.dispatch(changeAvatar(d.avatar_url || null));
        });
    };
  }

  componentWillMount() {
    this.props.dispatch(changeAvatar(null));
    changeTitle(intl.get('登录'));
  }

  checkID() {
    const { loginName, loginNameTip } = this.refs;
    const v = loginName.value;
    if (isEmpty(v)) {
      loginNameTip.postErr(intl.get('用户名不能为空'));
      return false;
    }
    if (!isValidID(v)) {
      loginNameTip.postErr(intl.get('用户名必须为邮箱或手机号'));
      return false;
    }
    return v;
  }

  checkPassword() {
    const { password, passwordTip } = this.refs;
    const v = password.value;
    if (isEmpty(v)) {
      passwordTip.postErr(intl.get('密码不能为空'));
      return false;
    }
    if (!isValidPassword(v)) {
      passwordTip.postErr(intl.get('密码格式不对'));
      return false;
    }
    return v;
  }

  render() {
    return (
      <form className="form-wrapper" action="/login" method="POST" noValidate>
        <input type="hidden" className="hidden" name="authenticity_token" value={getCSRFToken()} />
        <Tooltip className="mb-input" ref="loginNameTip">
          <input
            type="text" name="login_name" placeholder={intl.get('手机号码/邮箱')}
            autoFocus ref="loginName" onChange={this.clearTip('loginNameTip')} onBlur={this.onIDBlur}
            defaultValue={this.props.server.login_name}
          />
        </Tooltip>
        <Tooltip className="mb-input" ref="passwordTip">
          <input type="password" placeholder={intl.get('密码')} ref="password" name="password" onChange={this.clearTip('passwordTip')} />
        </Tooltip>
        <button className="btn btn-large" onClick={this.submit} ref="loginBtn">{intl.get('立即登录')}</button>
        <div className="space-between extra-info">
          <div className="rember-me">
            <input type="checkbox" id="rember-me-check" name="remember_me" />
            <label htmlFor="rember-me-check" className="cursor-pointer">{intl.get('记住我')}</label>
          </div>
          <Link className="link" to="reset_password">{intl.get('忘记密码？')}</Link>
        </div>
        <SocialLogin {...this.props} />
      </form>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func,
  server: PropTypes.any,
};

export default Login;
