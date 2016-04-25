import React, { PropTypes } from 'react';
import { partial, cloneDeep } from 'lodash';

import SocialLogin from './SocialLogin';
import PasswordInput from './PasswordInput';
import Tooltip from '../Tooltip';

import { isNotEmpty, isPhoneNumber, isEmail as isValidateEmail } from '../../share/validator';
import { openModal, updateUser } from '../../actions';

const overlayStyle = {
  overlay: { backgroundColor: 'rgba(37, 37, 37, 0.7)' },
};

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      isEmail: false,
      showValidate: true,
      tooltips: {
        firstInput: {
          isShow: false,
          type: 'error',
          msg: '',
        },
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
      const err = partial(this.postErr.bind(this), 'firstInput');
      const type = this.state.isEmail ? '邮箱' : '手机号';

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
        <div className="form-group mb-input">
          <input type="text" placeholder={isEmail ? '邮箱验证码' : '手机验证码'} />
          <div className="form-side" onClick={this.getCode}>
            {verifyButtonText}
          </div>
        </div>
        <PasswordInput placeholder="密码" className="mb-input" />
        <button className="btn btn-large">立即注册</button>
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
};

export default Register;
