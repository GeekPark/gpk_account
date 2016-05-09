import React, { PropTypes } from 'react';

import Main from '../Main';
import VerifyCode from '../../share/VerifyCode';
import Tooltip from '../../share/Tooltip';

import { sendVerifyCode, showErrorMessage, showSuccessMessage, setStore } from '../../../actions';

import { updateID, sendVerifyWithoutCaptcha, notExist } from '../../../share/server';
import { isEmail, isEmpty, isPhoneNumber } from '../../../share/validator';
import { showXHRError } from '../../../share/utils';

class EmailBind extends React.Component {
  constructor(props) {
    super(props);
    this.typeStr = ({ email: '邮箱', mobile: '手机' })[props.type];
    this.isEmail = props.type === 'email';

    this.onGetCode = () => {
      const id = this.getID();
      if (!id) return;
      const getCode = () => {
        sendVerifyWithoutCaptcha({ id, type: props.type })
          .done(() => {
            props.dispatch(sendVerifyCode());
            props.dispatch(showSuccessMessage(`验证码已经发送到您的${this.typeStr}`));
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

      updateID({ verify_code, type: props.type, id })
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
      dom.focus();
      return false;
    }
    if (!({ email: v => isEmail(v), mobile: v => isPhoneNumber(v) })[type](dom.value)) {
      err(`${this.typeStr}地址不正确`);
      dom.focus();
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
            />
          </Tooltip>
          <VerifyCode onGetCode={this.onGetCode} verify_code={verify_code} isEmail={this.isEmail} ref="verifyCode" />
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
};

EmailBind.contextTypes = {
  router: () => PropTypes.func.isRequired,
};

export default EmailBind;