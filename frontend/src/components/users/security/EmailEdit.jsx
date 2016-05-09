import React from 'react';
import ChangeID from './ChangeID';

class EmailEdit extends React.Component {
  render() {
    return <ChangeID title="修改邮箱" type="email" {...this.props} />;
  }
}

export default EmailEdit;
