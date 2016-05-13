import React from 'react';
import { Link } from 'react-router';
const { object } = React.PropTypes;

import SendVerify from './SendVerify';
import NewPassword from './NewPassword';

import { changeTitle } from '../../../share/utils';

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

  componentWillMount() {
    changeTitle('忘记密码');
  }

  render() {
    const hash = this.state.hash;
    let Component = SendVerify;
    if (hash === 'new') Component = NewPassword;
    return (
      <div className="form-wrapper form-reset">
        <div className="tal">
          <Link to="/login" className="back-btn">
            <i className="iconfont icon-back"></i>
            <span>返回登录</span>
          </Link>
        </div>
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
