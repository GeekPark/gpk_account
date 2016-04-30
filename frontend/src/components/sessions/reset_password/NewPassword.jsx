import React from 'react';

import PasswordInput from '../PasswordInput';

class NewPassword extends React.Component {
  render() {
    return (
      <div>
        <PasswordInput placeholder="新密码" className="mb-input" />
        <button className="btn btn-large">重设密码</button>
      </div>
    );
  }
}

export default NewPassword;
