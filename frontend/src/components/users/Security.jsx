import React, { PropTypes } from 'react';

class Security extends React.Component {
  render() {
    const { server } = this.props;
    const { email, mobile } = server.user;
    const is2FA = false;
    return (
      <div className="section security no-padding">
        <div className="section-title padding">账户安全</div>
        <div className="form-button-group">
          <div className="left-label">
            <span className="label-text">邮箱</span>
            <span className="form-info">{email}</span>
          </div>
          <div className="form-button">修改</div>
        </div>
        <div className="form-button-group">
          <div className="left-label">
            <span className="label-text">手机号码</span>
            <span className="form-info">{mobile}</span>
          </div>
          <div className="form-button">立即绑定</div>
        </div>
        <div className="form-button-group">
          <div className="left-label">
            <span className="label-text">密码</span>
          </div>
          <div className="form-button">修改</div>
        </div>
        <div className="form-button-group">
          <div className="left-label">
            <span className="label-text">两部验证</span>
            <span className="form-info">{is2FA ? '已绑定' : '未绑定'}</span>
          </div>
          <div className="form-button">{is2FA ? '取消绑定' : '立即绑定' }</div>
        </div>
      </div>
    );
  }
}

Security.propTypes = {
  server: PropTypes.any.isRequired,
};

export default Security;
