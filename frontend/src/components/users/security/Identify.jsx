import React, { PropTypes } from 'react';

import Main from '../Main';
import Select from '../../share/Select';

import VerifyCode from '../../share/VerifyCode';

import { sendVerifyWithoutCaptcha, verifyCurrentUser } from '../../../share/server';
import { showXHRError } from '../../../share/utils';
import { showMessage } from '../../../actions';

const trans = v => {
  const obj = { email: '邮箱', mobile: '手机' };
  return obj[v] || '';
};

class Identify extends React.Component {
  constructor() {
    super();

    this.getCode = () => {
      const type = this.getType();
      const isEmail = type === 'email';
      sendVerifyWithoutCaptcha({ isEmail, [type]: this.props.server.user[type] })
        .done(d => {
          if (d.success) this.props.dispatch(showMessage({ type: 'success', msg: `校验码已发送到您的${trans(type)}` }));
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
          this.props.dispatch(showMessage({ type: 'success', msg: '校验成功，自动跳转中。' }));
          setTimeout(() => {
            window.location.reload(true);
          }, 3000);
        })
        .fail(xhr => showXHRError(xhr, this.props.dispatch));
    };
  }
  getType() {
    return this.refs.type.refs.select.value;
  }
  getVerifyCodeValue() {
    return this.refs.verifyCode.refs.wrappedInstance.getValue();
  }
  render() {
    const { email, mobile } = this.props.server.user;
    const keys = { email, mobile };
    const options = Object.keys(keys)
      .filter(x => keys[x] !== null)
      .map(v => [v, `使用${trans(v)} ${keys[v]} 验证`]);
    return (
      <Main needPadding isCenter className="identify-wrapper"
        title="验证身份" desc="为了保证你的帐户安全，在继续操作之前请验证身份。"
      >
        <form onSubmit={this.submit}>
          <Select options={options} disabled={options.length === 1} className="mb-input" ref="type" />
          <VerifyCode onGetCode={this.getCode} verify_code={this.props.verify_code} ref="verifyCode" />
          <button className="btn btn-large">验证身份</button>
        </form>
      </Main>
    );
  }
}

Identify.propTypes = {
  server: PropTypes.any,
  verify_code: PropTypes.object,
  dispatch: PropTypes.func,
};

export default Identify;
