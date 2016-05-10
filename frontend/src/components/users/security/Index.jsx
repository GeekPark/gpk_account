import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import Main from '../Main';
import Identify from './Identify';

import { isSNS } from '../../../share/utils';

class Index extends React.Component {
  render() {
    const { server } = this.props;
    const { email, mobile, is_old } = server.user;
    const is2FA = false;
    const Comp = (
      <Main>
        <div className="w100p">
          <div className="form-button-group">
            <div className="left-label">
              <span className="label-text">邮箱</span>
              <span className="form-info">{email || '未绑定'}</span>
            </div>
            <Link to={email ? 'security/email' : 'security/email/bind'} className="form-button">{ email ? '修改' : '立即绑定' }</Link>
          </div>
          <div className="form-button-group">
            <div className="left-label">
              <span className="label-text">手机号码</span>
              <span className="form-info">{mobile || '未绑定'}</span>
            </div>
            <Link to={mobile ? 'security/mobile' : 'security/mobile/bind'} className="form-button">{ mobile ? '修改' : '立即绑定' }</Link>
          </div>
          {
            // if sns user, then do not show password input
            isSNS(this.props.server.user) ? null :
            <div className="form-button-group">
              <div className="left-label">
                <span className="label-text">密码</span>
              </div>
              <Link to="security/password/edit" className="form-button">修改</Link>
            </div>
          }
          <div className="form-button-group">
            <div className="left-label">
              <span className="label-text">两部验证</span>
              <span className="form-info">{is2FA ? '已绑定' : '未绑定'}</span>
            </div>
            <Link to={`security/2fa/${is2FA ? 'unbind' : 'bind'}`} className="form-button">
              {is2FA ? '取消绑定' : '立即绑定' }
            </Link>
          </div>
        </div>
      </Main>
    );

    return is_old ? <Identify {...this.props} /> : Comp;
  }
}

Index.propTypes = {
  server: PropTypes.any,
};

export default Index;
