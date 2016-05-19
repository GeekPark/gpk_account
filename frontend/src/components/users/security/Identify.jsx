import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import Main from '../Main';
import Select from '../../share/Select';

import VerifyCode from '../../share/VerifyCode';

import { sendVerifyWithoutCaptcha, verifyCurrentUser } from '../../../share/server';
import { showXHRError } from '../../../share/utils';
import { showSuccessMessage, sendVerifyCode, resetVerify } from '../../../actions';

const trans = v => {
  const obj = { email: '邮箱', mobile: '手机' };
  return obj[v] || '';
};

class Identify extends React.Component {
  constructor() {
    super();

    this.state = {
      isEmail: true,
      options: [],
    };

    this.getCode = () => {
      const type = this.getType();
      sendVerifyWithoutCaptcha({ type, id: this.props.server.user[type] })
        .done(d => {
          if (d.success) {
            this.props.dispatch(sendVerifyCode());
            this.props.dispatch(showSuccessMessage(`校验码已发送到您的${trans(type)}`));
          }
        })
        .fail(xhr => showXHRError(xhr, this.props.dispatch));
    };

    this.submit = e => {
      e.preventDefault();
      const v = this.getVerifyCodeValue();
      if (v === false) return;
      const type = this.getType();
      const id = this.props.server.user[type];

      verifyCurrentUser({ verify_code: v, type, id })
        .done(() => {
          this.props.dispatch(showSuccessMessage('校验成功，自动跳转中。'));
          setTimeout(() => {
            if (this.props.redirect) {
              this.context.router.push('/security');
            } else {
              window.location.reload(true);
            }
          }, 2500);
        })
        .fail(xhr => showXHRError(xhr, this.props.dispatch));
    };

    this.onChange = () => {
      this.setState({ isEmail: this.getType() === 'email' });
      this.props.dispatch(resetVerify());
    };
  }
  componentWillMount() {
    const { email, mobile } = this.props.server.user;
    const keys = { email, mobile };
    const options = Object.keys(keys)
      .filter(x => keys[x] !== null)
      .map(v => [v, `使用${trans(v)} ${keys[v]} 验证`]);

    this.setState({
      options,
      isEmail: options[0][0] === 'email',
    });
  }
  getType() {
    return this.refs.type.refs.select.value;
  }
  getVerifyCodeValue() {
    return this.refs.verifyCode.refs.wrappedInstance.getValue();
  }
  render() {
    const { options, isEmail } = this.state;
    const { is_old } = this.props.server.user;
    return (
      <Main needPadding isCenter className="identify-wrapper"
        title="验证身份" desc="为了保证你的帐户安全，在继续操作之前请验证身份。"
      >
        <form onSubmit={this.submit}>
          <Select options={options} disabled={options.length === 1}
            className="mb-input" ref="type" onChange={this.onChange}
          />
          <VerifyCode onGetCode={this.getCode} ref="verifyCode"
            isEmail={isEmail} verify_code={this.props.verify_code}
          />
          <button className="btn btn-large">验证身份</button>
          {
            !is_old ? null :
            <div className="tar old_user_link">
              <Link className="link" to="/security/email/bind">我不再使用这个邮箱，换个邮箱</Link>
            </div>
          }
        </form>
      </Main>
    );
  }
}

Identify.propTypes = {
  server: PropTypes.any,
  verify_code: PropTypes.object,
  dispatch: PropTypes.func,
  redirect: PropTypes.bool,
};

Identify.contextTypes = {
  router: () => PropTypes.func.isRequired,
};

export default Identify;
