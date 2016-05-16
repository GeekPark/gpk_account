import React, { PropTypes } from 'react';

import Main from '../Main';
import VerifyCode from '../../share/VerifyCode';
import Tooltip from '../../share/Tooltip';
import PasswordInput from '../../sessions/PasswordInput';

import { sendVerifyCode, showErrorMessage, showSuccessMessage, setStore } from '../../../actions';

import { updateID, sendVerifyWithoutCaptcha, notExist } from '../../../share/server';
import { isEmail, isEmpty, isPhoneNumber } from '../../../share/validator';
import { showXHRError, isSNS, focus } from '../../../share/utils';

class EmailBind extends React.Component {
  constructor(props) {
    super(props);
    this.typeStr = ({ email: '邮箱', mobile: '新手机' })[props.type];
    this.isEmail = props.type === 'email';
    this.isSNS = isSNS(props.server.user);

    this.onGetCode = () => {
      const id = this.getID();
      if (!id) return;
      const getCode = () => {
        sendVerifyWithoutCaptcha({ id, type: props.type })
          .done(() => {
            props.dispatch(sendVerifyCode());
            props.dispatch(showSuccessMessage(`校验码已经发送到您的${this.typeStr}`));
          })
          .fail(xhr => showXHRError(xhr, props.dispatch));
      };

      notExist(id).then(
        getCode,
        () => props.dispatch(showErrorMessage(`${this.typeStr}已被其他用户注册`))
      );
    };

    this.submit = e => {
      e.preventDefault();
      const id = this.getID();
      if (!id) return;
      const verify_code = this.refs.verifyCode.refs.wrappedInstance.getValue();
      if (!verify_code) return;
      let password;
      if (this.isSNS) password = this.refs.password.getValue();
      if (password === false) return;

      updateID({ verify_code, type: props.type, id, password })
        .done(user => {
          // update global user
          props.dispatch(setStore({ user }));
          props.dispatch(showSuccessMessage('修改成功，跳转中'));
          setTimeout(() => {
            this.context.router.push('/security');
          }, 4000);
        })
        .fail(xhr => showXHRError(xhr, props.dispatch));
    };

    this.clearTip = tipName => () => this.refs[tipName].clear();
  }
  getID() {
    const dom = this.refs.id;
    const err = msg => this.refs.idTip.postErr(msg);
    const type = this.props.type;
    if (isEmpty(dom.value)) {
      err(`${this.typeStr}不能为空`);
      focus(dom);
      return false;
    }
    if (!({ email: isEmail, mobile: isPhoneNumber })[type](dom.value)) {
      err(`${this.typeStr}格式不正确`);
      focus(dom);
      return false;
    }
    return dom.value;
  }
  render() {
    const { verify_code, title, desc } = this.props;

    return (
      <Main className="change-id-panel" title={title} isCenter needPadding desc={desc}>
        <form className="container" onSubmit={this.submit}>
          <Tooltip ref="idTip">
            <input className="mb-input" type="text" placeholder={this.typeStr}
              ref="id" onChange={this.clearTip('idTip')} autoFocus
              maxLength={this.props.type === 'mobile' ? 11 : 100}
            />
          </Tooltip>
          <VerifyCode onGetCode={this.onGetCode} verify_code={verify_code} isEmail={this.isEmail} ref="verifyCode" />
          {
            !this.isSNS ? null :
            <PasswordInput placeholder="密码" className="mb-input" ref="password" />
          }
          <button className="btn btn-large">提交</button>
        </form>
      </Main>
    );
  }
}

EmailBind.propTypes = {
  verify_code: PropTypes.object,
  dispatch: PropTypes.func,
  desc: PropTypes.string,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  server: PropTypes.any.isRequired,
};

EmailBind.contextTypes = {
  router: () => PropTypes.func.isRequired,
};

export default EmailBind;
