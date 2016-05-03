import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import Main from '../Main';

class Index extends React.Component {
  render() {
    const { server } = this.props;
    const { email, mobile } = server.user;
    const is2FA = false;
    return (
      <Main>
        <div className="w100p">
          <div className="form-button-group">
            <div className="left-label">
              <span className="label-text">邮箱</span>
              <span className="form-info">{email || '未绑定'}</span>
            </div>
            <Link to="security/email" className="form-button">{ email ? '修改' : '立即绑定' }</Link>
          </div>
          <div className="form-button-group">
            <div className="left-label">
              <span className="label-text">手机号码</span>
              <span className="form-info">{mobile || '未绑定'}</span>
            </div>
            <div className="form-button">{ mobile ? '修改' : '立即绑定' }</div>
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
      </Main>
    );
  }
}

Index.propTypes = {
  server: PropTypes.any,
};

export default Index;
