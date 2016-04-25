import React, { PropTypes } from 'react';
import cloneDeep from 'lodash/cloneDeep';

import SocialLogin from './SocialLogin';
import PasswordInput from './PasswordInput';
import Tooltip from '../Tooltip';

import { isNotEmpty, isPhoneNumber, isEmail as isValidateEmail } from '../../share/validator';
import { openModal, updateUser } from '../../actions';
import { createUser } from '../../share/server';

const overlayStyle = {
  overlay: { backgroundColor: 'rgba(37, 37, 37, 0.7)' },
};

const defaultTip = {
  isShow: false,
  type: 'error',
  msg: '',
};

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      isEmail: false,
      showValidate: true,
      tooltips: {
        firstInput: { ...defaultTip },
        validateCode: { ...defaultTip },
        password: { ...defaultTip },
      },
    };

    this.toggleType = () => {
      this.setState({ isEmail: !this.state.isEmail });
      this.clearAllTip();
      this.refs.firstInput.focus();
    };

    this.getCode = () => {
      if (this.props.verify_code.pending) return;
      const dom = this.refs.firstInput;
      const v = dom.value;
      const { isEmail } = this.state;
      const err = msg => this.postErr('firstInput', msg);
      const type = this.typeStr();

      if (!isNotEmpty(v)) {
        err(`${type}不能为空`);
        dom.focus();
        return;
      }

      if (
        (isEmail && !isValidateEmail(v)) || (!isEmail && !isPhoneNumber(v))
      ) {
        err(`${type}格式不对`);
        dom.focus();
        return;
      } else {
        this.props.dispatch(updateUser({
          isEmail: this.state.isEmail,
          id: v,
        }));
        this.props.dispatch(openModal('ValidatorIMG', overlayStyle));
      }
    };

    this.clearTip = tipName => this.hideTip.bind(this, tipName);

    this.submit = () => {
      if (!this.props.user.isValidated) {
        this.postErr('firstInput', `请填写${this.typeStr()}，并点击获取验证码`);
        this.refs.firstInput.focus();
        return;
      }

      if (this.refs.verifyCode.value.length === 0) {
        this.postErr('validateCode', '请填写收到的验证码');
        return;
      }

      if (!(this.getPwd() && this.getPwd().length > 0)) {
        this.postErr('password', '请填写密码');
        return;
      }

      const user = { password: this.getPwd() };
      const key = this.props.user.isEmail ? 'email' : 'mobile';
      user[key] = this.props.user.id;

      createUser({
        verify_code: this.refs.verifyCode.value,
        user,
      }).done(d => {
        console.info(d);
        alert('注册成功');
      }).error(jqXHR => {
        console.error(jqXHR);
      });
    };
  }

  getPwd() {
    return this.refs.password.refs.input.value;
  }

  typeStr() {
    return this.state.isEmail ? '邮箱' : '手机号';
  }

  postErr(tipName, msg) {
    const newTips = cloneDeep(this.state.tooltips);
    newTips[tipName] = { ...newTips[tipName], type: 'error', msg, isShow: true };
    this.setState({ tooltips: newTips });
  }

  hideTip(tipName) {
    const newTips = cloneDeep(this.state.tooltips);
    newTips[tipName].isShow = false;
    this.setState({ tooltips: newTips });
  }

  clearAllTip() {
    const newTips = cloneDeep(this.state.tooltips);
    Object.keys(newTips).forEach(x => {
      newTips[x].isShow = false;
    });

    this.setState({ tooltips: newTips });
  }

  render() {
    const { isEmail, tooltips } = this.state;
    const { verify_code } = this.props;
    let verifyButtonText = '获取验证码';
    if (verify_code.pending) verifyButtonText = `${verify_code.countdown}s`;
    if (!verify_code.pending && !verify_code.isFirst) verifyButtonText = '重新获取';
    return (
      <div className="form-wrapper">
        <Tooltip info={tooltips.firstInput} className="mb-input">
          <input type="text" autoFocus ref="firstInput"
            placeholder={isEmail ? '请输入邮箱地址' : '手机号码（仅支持中国大陆）'}
            onChange={this.clearTip('firstInput')}
          />
        </Tooltip>
        <Tooltip
          info={tooltips.validateCode} className="form-group mb-input"
        >
          <div>
            <input type="text" ref="verifyCode" onChange={this.clearTip('validateCode')}
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
        <SocialLogin />
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
