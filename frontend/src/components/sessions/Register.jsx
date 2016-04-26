import React, { PropTypes } from 'react';

import SocialLogin from './SocialLogin';
import PasswordInput from './PasswordInput';

import { isEmpty, isPhoneNumber, isEmail as isValidateEmail } from '../../share/validator';
import { openModal, updateUser } from '../../actions';
import { createUser } from '../../share/server';
import { parseErr } from '../../share/utils';

import Tooltip from '../Tooltip';
import { initState, postErr, clearAllTip, hideTip } from '../../share/tooltip';

const overlayStyle = {
  overlay: { backgroundColor: 'rgba(37, 37, 37, 0.7)' },
};

const TOOLTIPS = ['firstInput', 'verifyCode', 'password'];

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      ...initState(TOOLTIPS),
      isEmail: false,
      showValidate: true,
    };

    this.postErr = postErr.bind(this);
    this.clearAllTip = clearAllTip.bind(this);
    this.hideTip = hideTip.bind(this);
    this.clearTip = tipName => this.hideTip.bind(this, tipName);

    this.toggleType = () => {
      this.setState({ isEmail: !this.state.isEmail });
      this.clearAllTip();
      this.clearInput();
      this.refs.firstInput.focus();
    };

    this.getCode = () => {
      if (this.props.verify_code.pending) return;
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
        console.info(d);
        alert('注册成功');
      }).fail(xhr => {
        const errStr = parseErr(xhr.responseText);
        if (errStr) {
          this.postErr('verifyCode', errStr[0]);
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
      this.postErr('firstInput', `${typeStr}不能为空`);
      firstInput.focus();
      return false;
    }
    if ((isEmail && !isValidateEmail(v)) || (!isEmail && !isPhoneNumber(v))) {
      this.postErr('firstInput', `${typeStr}格式不对`);
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
      this.getCode();
      return false;
    }
    if (isEmpty(verifyCode.value)) {
      this.postErr('verifyCode', `请填写${typeStr}收到的验证码`);
      verifyCode.focus();
      return false;
    }
    if (isEmpty(this.getPwd())) {
      this.postErr('password', '请输入密码');
      this.refs.password.refs.input.focus();
      return false;
    }
    return true;
  }

  render() {
    const { isEmail, tooltips } = this.state;
    const { verify_code } = this.props;
    let verifyButtonText = '获取验证码';
    if (verify_code.pending) verifyButtonText = `重新发送(${verify_code.countdown}s)`;
    if (!verify_code.pending && !verify_code.isFirst) verifyButtonText = '重新获取';
    return (
      <div className="form-wrapper">
        <Tooltip info={tooltips.firstInput} className="mb-input">
          <input type="text" autoFocus ref="firstInput"
            placeholder={isEmail ? '邮箱' : '手机号码（仅支持中国大陆）'}
            maxLength={isEmail ? '100' : '11'}
            onChange={this.clearTip('firstInput')}
          />
        </Tooltip>
        <Tooltip
          info={tooltips.verifyCode} className="form-group mb-input"
        >
          <div>
            <input type="text" ref="verifyCode" onChange={this.clearTip('verifyCode')}
              placeholder={isEmail ? '邮箱验证码' : '手机验证码'} maxLength="6"
            />
            <div className="form-side" onClick={this.getCode}>
              {verifyButtonText}
            </div>
          </div>
        </Tooltip>
        <Tooltip
          info={tooltips.password} className="mb-input"
        >
          <PasswordInput placeholder="密码" ref="password" onChange={this.clearTip('password')} />
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
