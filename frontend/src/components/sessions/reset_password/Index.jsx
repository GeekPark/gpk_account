import React from 'react';
const { object } = React.PropTypes;

import SendVerify from './SendVerify';
import NewPassword from './NewPassword';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hash: props.location.hash,
      loginName: '',
    };

    this.goPanel = panelName => {
      let newHash = '';
      if (panelName === 'new') newHash = 'new';
      this.setState({ hash: newHash });
    };

    this.changeLoginName = loginName => this.setState({ loginName });
  }
  render() {
    const hash = this.state.hash;
    let Component = SendVerify;
    if (hash === 'new') Component = NewPassword;
    return (
      <div className="form-wrapper form-reset">
        <div className="form-title">
          重设密码
        </div>
        <p className="form-desc">
          校验码将会发送至你的注册邮箱或手机
        </p>
        <Component {...this.props} goPanel={this.goPanel}
          changeLoginName={this.changeLoginName} loginName={this.state.loginName}
        />
      </div>
    );
  }
}

ResetPassword.propTypes = {
  location: object,
};

export default ResetPassword;
