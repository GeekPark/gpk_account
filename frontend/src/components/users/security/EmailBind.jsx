import React from 'react';
import Email from './Email';

class EmailBind extends React.Component {
  render() {
    return <Email title="绑定邮箱" desc="绑定后即可使用邮箱+密码进行登录" {...this.props} />;
  }
}

export default EmailBind;
