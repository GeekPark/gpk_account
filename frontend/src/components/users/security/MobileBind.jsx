import React from 'react';
import ChangeID from './ChangeID';

const MobileBind = props => (
  <ChangeID title="绑定手机" desc="绑定手机后即可使用手机号+密码登录。" type="mobile" isEmail={false} {...props} />
);

export default MobileBind;
