import React from 'react';
import ChangeID from './ChangeID';

class EmailBind extends React.Component {
  render() {
    return <ChangeID title="绑定邮箱" desc="绑定后即可使用邮箱+密码进行登录" type="email" {...this.props} />;
  }
}

export default EmailBind;
