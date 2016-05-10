import React from 'react';
import ChangeID from './ChangeID';

const EmailBind = props => (
  <ChangeID title="绑定邮箱" desc="绑定后即可使用邮箱+密码进行登录" type="email" {...props} />
);

export default EmailBind;
