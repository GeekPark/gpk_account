import React from 'react';
import ChangeID from './ChangeID';

const MobileEdit = props => (
  <ChangeID title="修改手机" desc="修改您当前的手机号码" type="mobile" isEmail={false} {...props} />
);

export default MobileEdit;
