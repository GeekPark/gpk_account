import React from 'react';

class Login extends React.Component {
  render() {
    return (
      <div className="login-form">
        <input type="text" placeholder="手机号码/邮箱" autoFocus />
        <input type="password" placeholder="密码" />
        <button className="btn btn-large btn-blue">立即登陆</button>
      </div>
    );
  }
}

export default Login;
