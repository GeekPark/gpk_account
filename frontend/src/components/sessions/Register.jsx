import React from 'react';
import SocialLogin from './SocialLogin';
import PasswordInput from './PasswordInput';

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      isEmail: false,
      showValidate: true,
    };

    this.toggleType = () => {
      this.setState({ isEmail: !this.state.isEmail });
      this.refs.firstInput.focus();
    };

    this.getCode = () => 'getCode';
  }
  render() {
    const { isEmail } = this.state;
    return (
      <div className="form-wrapper">
        <input type="text" autoFocus placeholder={isEmail ? '请输入邮箱地址' : '手机号码（仅支持中国大陆）'} ref="firstInput" />
        <div className="form-group">
          <input type="text" placeholder={isEmail ? '邮箱验证码' : '手机验证码'} />
          <div className="form-side" onClick={this.getCode}>
            获取验证码
          </div>
        </div>
        <PasswordInput placeholder="密码" />
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

export default Register;
