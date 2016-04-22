import React, { PropTypes } from 'react';
import PasswordInput from './PasswordInput';

const Step0 = (props) => (
  <div>
    <input type="text" placeholder="手机号码/邮箱" />
    <button className="btn btn-large" onClick={props.goStep}>获取验证码</button>
  </div>
);

Step0.propTypes = { goStep: PropTypes.func.isRequired };

const Step1 = () => (
  <div>
    <PasswordInput placeholder="新密码" />
    <div className="form-group">
      <input type="text" placeholder="验证码" />
      <div className="form-side">
        获取验证码
      </div>
    </div>
    <button className="btn btn-large">重设密码</button>
  </div>
);

class ResetPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 0,
    };

    this.goStep = () => this.setState({ step: 1 });
  }
  render() {
    const { step } = this.state;
    return (
      <div className="form-wrapper form-reset">
        <div className="form-title">
          重设密码
        </div>
        <p className="form-desc">
          验证码将会发送至你的注册邮箱或手机
        </p>
        {
          step === 0 ? <Step0 goStep={this.goStep} /> : <Step1 />
        }
      </div>
    );
  }
}

export default ResetPassword;
