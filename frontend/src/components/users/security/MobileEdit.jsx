import React from 'react';
import ChangeID from './ChangeID';

class MobileEdit extends React.Component {
  render() {
    return (
      <ChangeID title="修改手机" desc="修改您当前的手机号码" type="mobile" isEmail={false} {...this.props} />
    );
  }
}

export default MobileEdit;
