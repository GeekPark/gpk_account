import React from 'react';
import Email from './Email';

class EmailEdit extends React.Component {
  render() {
    return <Email title="修改邮箱" desc="" {...this.props} />;
  }
}

export default EmailEdit;
