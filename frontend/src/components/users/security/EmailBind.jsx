import React, { PropTypes } from 'react';

import Main from '../Main';
import VerifyCode from '../../share/VerifyCode';

class EmailBind extends React.Component {
  constructor() {
    super();

    this.onGetCode = () => {};
  }
  render() {
    const { verify_code } = this.props;

    return (
      <Main title="绑定邮箱" isCenter needPadding className="email-panel" desc="绑定后即可使用邮箱+密码进行登录">
        <div className="container">
          <input className="mb-input" type="text" placeholder="邮箱" />
          <VerifyCode onGetCode={this.onGetCode} verify_code={verify_code} isEmail />
          <button className="btn btn-large">提交</button>
        </div>
      </Main>
    );
  }
}

EmailBind.propTypes = {
  verify_code: PropTypes.object,
};

export default EmailBind;
