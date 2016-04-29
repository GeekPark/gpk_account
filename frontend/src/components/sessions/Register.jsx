import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import SocialLogin from './SocialLogin';
import PasswordInput from './PasswordInput';

import { isEmpty, isPhoneNumber, isEmail as isValidEmail, isValidPassword } from '../../share/validator';
import { openModal, updateUser, showMessage, resetVerify } from '../../actions';
import { createUser } from '../../share/server';
import { parseErr } from '../../share/utils';

import Tooltip from '../share/Tooltip';

import Welcome from '../welcome/Index';

const overlayStyle = {
  overlay: { backgroundColor: 'rgba(37, 37, 37, 0.7)' },
};


class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmail: false,
      showValidate: true,
    };

    this.isPendingVerify = () => this.props.verify_code.countdown > 0;

    this.clearAllTip = () => {
      Object.keys(this.refs).forEach(x => {
        if (this.refs[x].isTooltip) this.refs[x].clear();
      });
    };
    this.clearTip = tipName => () => this.refs[tipName].clear();

    this.toggleType = () => {
      this.setState({ isEmail: !this.state.isEmail });
      this.clearAllTip();
      this.clearInput();
      this.props.dispatch(resetVerify());
      this.refs.firstInput.focus();
    };

    this.getCode = () => {
      if (this.isPendingVerify()) return;
      if (!this.isValidFirstInput()) return;
      this.props.dispatch(updateUser({
        isEmail: this.state.isEmail,
        id: this.refs.firstInput.value,
      }));
      this.props.dispatch(openModal('ValidatorIMG', overlayStyle));
      this.clearAllTip();
    };

    this.submit = () => {
      if (!this.check()) return;
      const user = { password: this.getPwd() };
      const key = this.props.user.isEmail ? 'email' : 'mobile';
      user[key] = this.props.user.id;

      createUser({
        verify_code: this.refs.verifyCode.value,
        user,
      }).done(d => {
        const dom = document.querySelector('#component-session');
        ReactDOM.unmountComponentAtNode(dom);
        ReactDOM.render(<Welcome data={d} />, dom);
      }).fail(xhr => {
        const errStr = parseErr(xhr.responseText);
        if (errStr) {
          this.props.dispatch(showMessage({ type: 'error', msg: errStr }));
        }
      });
    };
  }

  getPwd() {
    return this.refs.password.refs.input.value;
  }

  typeStr() {
    return this.state.isEmail ? '邮箱' : '手机号';
  }

  clearInput() {
    for (const x in this.refs) {
      if (/input/i.test(this.refs[x].nodeName)) this.refs[x].value = '';
    }
  }

  isValidFirstInput() {
    const { isEmail } = this.state;
    const { firstInput } = this.refs;
    const v = firstInput.value;
    const typeStr = this.typeStr();
    if (isEmpty(v)) {
      this.refs.firstInputTip.postErr(`${typeStr}不能为空`);
      firstInput.focus();
      return false;
    }
    if ((isEmail && !isValidEmail(v)) || (!isEmail && !isPhoneNumber(v))) {
      this.refs.firstInputTip.postErr(`${typeStr}格式不对`);
      firstInput.focus();
      return false;
    }
    return true;
  }

  check() {
    const { verifyCode } = this.refs;
    const typeStr = this.typeStr();
    if (!this.isValidFirstInput()) return false;
    if (!this.props.user.isValidated) {
      this.refs.verifyCodeTip.postErr('请获取验证码并输入');
      return false;
    }
    if (isEmpty(verifyCode.value)) {
      this.refs.verifyCodeTip.postErr(`请填写${typeStr}收到的验证码`);
      verifyCode.focus();
      return false;
    }
    if (isEmpty(this.getPwd())) {
      this.refs.passwordTip.postErr('请输入密码');
      this.refs.password.refs.input.focus();
      return false;
    }
    if (!isValidPassword(this.getPwd())) {
      this.refs.passwordTip.postErr('密码长度必须在 6-20 位');
      this.refs.password.refs.input.focus();
      return false;
    }
    return true;
  }

  render() {
    const { isEmail } = this.state;
    const { verify_code } = this.props;
    let verifyButtonText = '获取验证码';
    if (this.isPendingVerify()) verifyButtonText = `重新发送(${verify_code.countdown}s)`;
    else if (!verify_code.isFirst) verifyButtonText = '重新发送';

    return (
      <div className="form-wrapper">
        <Tooltip className="mb-input" ref="firstInputTip">
          <input type="text" autoFocus ref="firstInput"
            placeholder={isEmail ? '邮箱' : '手机号码（仅支持中国大陆）'}
            maxLength={isEmail ? '100' : '11'}
            onChange={this.clearTip('firstInputTip')}
          />
        </Tooltip>
        <Tooltip className="form-group mb-input" ref="verifyCodeTip">
          <div>
            <input type="text" ref="verifyCode" onChange={this.clearTip('verifyCodeTip')}
              placeholder={isEmail ? '邮箱验证码' : '手机验证码'} maxLength="6"
            />
            <div className="form-side" onClick={this.getCode}>
              {verifyButtonText}
            </div>
          </div>
        </Tooltip>
        <Tooltip className="mb-input" ref="passwordTip">
          <PasswordInput placeholder="密码" ref="password" onChange={this.clearTip('passwordTip')} />
        </Tooltip>
        <button className="btn btn-large" onClick={this.submit}>立即注册</button>
        <div className="tar extra-info">
          <a className="link" href="javascript:;" onClick={this.toggleType} >
            { isEmail ? '使用手机注册' : '使用邮箱注册' }
          </a>
        </div>
        <SocialLogin {...this.props} />
      </div>
    );
  }
}

Register.propTypes = {
  dispatch: PropTypes.func,
  verify_code: PropTypes.object,
  user: PropTypes.object,
};

export default Register;
