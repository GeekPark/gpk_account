import React, { PropTypes } from 'react';

import PasswordInput from '../PasswordInput';
import VerifyCode from '../../share/VerifyCode';
import { resetPassword } from '../../../share/server';
import { showXHRError } from '../../../share/utils';
import { isEmail } from '../../../share/validator';
import { showSuccessMessage } from '../../../actions';

class NewPassword extends React.Component {
  constructor() {
    super();

    this.goBack = () => this.props.goPanel('/');

    this.submit = e => {
      e.preventDefault();
      const { password } = this.refs;
      const pwd = password.getValue();
      if (pwd === false) return;
      const verifyCode = this.getVerifyCodeInstance().getValue();
      if (!verifyCode) return;

      const params = {
        verify_code: verifyCode,
        user: {
          email: this.props.loginName,
          password: pwd,
        },
      };

      resetPassword(params)
        .done(d => {
          this.props.dispatch(showSuccessMessage('密码修改成功，正在跳转中'));
          setTimeout(() => {
            window.location.href = d.callback_url;
          }, 3000);
        }).fail(xhr => showXHRError(xhr, this.props.dispatch));
    };
  }

  getVerifyCodeInstance() {
    return this.refs.verifyCode.refs.wrappedInstance;
  }

  render() {
    return (
      <form onSubmit={this.submit} noValidate autoComplete="off">
        <VerifyCode onGetCode={this.goBack} ref="verifyCode" autofocus isEmail={isEmail(this.props.loginName)} />
        <PasswordInput placeholder="新密码" className="mb-input" ref="password" />
        <button className="btn btn-large">重设密码</button>
      </form>
    );
  }
}

NewPassword.propTypes = {
  goPanel: PropTypes.func.isRequired,
  loginName: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};

export default NewPassword;
