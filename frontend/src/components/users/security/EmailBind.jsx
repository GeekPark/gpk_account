import React, { PropTypes } from 'react';

import Main from '../Main';
import VerifyCode from '../../share/VerifyCode';
import Tooltip from '../../share/Tooltip';

import { isEmail, isEmpty } from '../../../share/validator';
import { sendVerifyCode } from '../../../actions';

class EmailBind extends React.Component {
  constructor() {
    super();
    this.onGetCode = () => {
      const email = this.getEmail();
      if (!email) return;
      this.props.dispatch(sendVerifyCode());
    };

    this.submit = () => {
      const email = this.getEmail();
      if (!email) return;
      const verifyCode = this.refs.verifyCode.refs.wrappedInstance.getValue();
      if (!verifyCode) return;
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
    const { verify_code } = this.props;

    return (
      <Main title="绑定邮箱" isCenter needPadding className="email-panel" desc="绑定后即可使用邮箱+密码进行登录">
        <div className="container">
          <Tooltip ref="emailTip">
            <input className="mb-input" type="text" placeholder="邮箱" ref="email" onChange={this.clearTip('emailTip')} />
          </Tooltip>
          <VerifyCode onGetCode={this.onGetCode} verify_code={verify_code} isEmail ref="verifyCode" />
          <button className="btn btn-large">提交</button>
        </div>
      </Main>
    );
  }
}

EmailBind.propTypes = {
  verify_code: PropTypes.object,
  dispatch: PropTypes.func,
};

export default EmailBind;
