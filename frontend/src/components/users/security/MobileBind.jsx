import React from 'react';
import ChangeID from './ChangeID';

class MobileBind extends React.Component {
  render() {
    return (
      <ChangeID title="绑定手机" desc="绑定手机后即可使用手机号+密码登录。" type="mobile" isEmail={false} {...this.props} />
    );
  }
}

export default MobileBind;
