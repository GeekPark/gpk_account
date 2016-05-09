import React, { PropTypes } from 'react';

import Main from '../Main';
import VerifyCode from '../../share/VerifyCode';
import Tooltip from '../../share/Tooltip';

import { sendVerifyCode, showErrorMessage, showSuccessMessage, setStore } from '../../../actions';

import { updateID, sendVerifyWithoutCaptcha, notExist } from '../../../share/server';
import { isEmail, isEmpty } from '../../../share/validator';
import { showXHRError } from '../../../share/utils';

class EmailBind extends React.Component {
  constructor() {
    super();
    this.onGetCode = () => {
      const email = this.getEmail();
      if (!email) return;
      const getCode = () => {
        sendVerifyWithoutCaptcha({ id: email, type: 'email' })
          .done(() => {
            this.props.dispatch(sendVerifyCode());
            this.props.dispatch(showSuccessMessage('验证码已经发送到您的邮箱'));
          })
          .fail(xhr => showXHRError(xhr, this.props.dispatch));
      };

      notExist(email).then(
        getCode,
        () => this.props.dispatch(showErrorMessage('邮箱地址已存在'))
      );
    };

    this.submit = e => {
      e.preventDefault();
      const email = this.getEmail();
      if (!email) return;
      const verify_code = this.refs.verifyCode.refs.wrappedInstance.getValue();
      if (!verify_code) return;

      updateID({ verify_code, type: 'email', id: email })
        .done(user => {
          // update global user
          this.props.dispatch(setStore({ user }));
          this.props.dispatch(showSuccessMessage('修改成功，跳转中'));
          setTimeout(() => {
            this.context.router.push('/security');
          }, 5000);
        })
        .fail(xhr => showXHRError(xhr, this.props.dispatch));
    };

    this.clearTip = tipName => () => this.refs[tipName].clear();
  }
  getEmail() {
    const dom = this.refs.email;
    const err = msg => this.refs.emailTip.postErr(msg);
    if (isEmpty(dom.value)) {
      err('邮箱不能为空');
      dom.focus();
      return false;
    }
    if (!isEmail(dom.value)) {
      err('邮箱地址不正确');
      dom.focus();
      return false;
    }
    return dom.value;
  }
  render() {
    const { verify_code, title, desc } = this.props;

    return (
      <Main className="email-panel" title={title} isCenter needPadding desc={desc}>
        <form className="container" onSubmit={this.submit}>
          <Tooltip ref="emailTip">
            <input className="mb-input" type="text" placeholder="邮箱" ref="email" onChange={this.clearTip('emailTip')} autoFocus />
          </Tooltip>
          <VerifyCode onGetCode={this.onGetCode} verify_code={verify_code} isEmail ref="verifyCode" />
          <button className="btn btn-large">提交</button>
        </form>
      </Main>
    );
  }
}

EmailBind.propTypes = {
  verify_code: PropTypes.object,
  dispatch: PropTypes.func,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string,
};

EmailBind.contextTypes = {
  router: () => PropTypes.func.isRequired,
};

export default EmailBind;
