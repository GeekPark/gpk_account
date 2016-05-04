import React, { PropTypes } from 'react';

import PasswordInput from '../PasswordInput';
import VerifyCode from '../../share/VerifyCode';
import { resetPassword } from '../../../share/server';
import { showXHRError } from '../../../share/utils';
import { showMessage } from '../../../actions';

class NewPassword extends React.Component {
  constructor() {
    super();

    this.goBack = () => this.props.goPanel('/');

    this.submit = () => {
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
          this.props.dispatch(showMessage({ type: 'success', msg: '密码修改成功，正在跳转中' }));
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
      <div>
        <PasswordInput placeholder="新密码" className="mb-input" autofocus ref="password" />
        <VerifyCode onGetCode={this.goBack} ref="verifyCode" />
        <button className="btn btn-large" onClick={this.submit}>重设密码</button>
      </div>
    );
  }
}

NewPassword.propTypes = {
  goPanel: PropTypes.func.isRequired,
  loginName: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};

export default NewPassword;
