import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import Main from '../Main';

import { isSNS, showXHRError } from '../../../share/utils';
import { isIdentified, unbind2FA } from '../../../share/server';
import { showErrorMessage, showSuccessMessage, setStore } from '../../../actions';

class Index extends React.Component {
  constructor() {
    super();

    this.checkIdentify = this.checkIdentify.bind(this);
    this.banOld = e => this.checkIdentify.call(this, e, 'old');

    this.cancleTFABind = e => {
      e.preventDefault();

      isIdentified().then(
        this.sendUnbind2FA.bind(this),
        () => {
          this.context.router.push({
            pathname: '/security/identify',
            state: { onSuccess: this.sendUnbind2FA.bind(this) },
          });
        }
      );
    };
  }
  sendUnbind2FA() {
    unbind2FA()
      .done(user => {
        if (user.two_factor_enable === false) {
          this.props.dispatch(showSuccessMessage('两部验证解绑成功'));
          this.props.dispatch(setStore({ user }));
        }
      })
      .fail(xhr => showXHRError(xhr, this.props.dispatch));
  }
  checkIdentify(e, ban) {
    const { user } = this.props.server;
    // is user isn't sns and old then do nothing;
    if (!isSNS(user) && !user.is_old) return;

    // is only need ban old && user not old then exit
    if (ban === 'old' && !user.is_old) return;

    e.preventDefault();

    const msg = user.is_old ? '请验证邮箱后再进行后续设置。' : '请绑定邮箱或手机后再进行后续设置。';
    this.props.dispatch(showErrorMessage(msg));
  }
  render() {
    const { server } = this.props;
    const { email, mobile, is_old, two_factor_enable } = server.user;

    let emailURL = email ? 'security/email' : 'security/email/bind';
    let emailStr = email ? '修改' : '立即绑定';

    if (is_old) {
      emailStr = '立即验证';
      emailURL = 'security/identify';
    }

    return (
      <Main>
        <div className="w100p">
          <div className="form-button-group">
            <div className="left-label">
              <span className="label-text">邮箱</span>
              <span className="form-info">{email || '未绑定'}{is_old ? '（未验证）' : ''}</span>
            </div>
            <Link to={emailURL} className="form-button">{emailStr}</Link>
          </div>
          <div className="form-button-group">
            <div className="left-label">
              <span className="label-text">手机号码</span>
              <span className="form-info">{mobile || '未绑定'}</span>
            </div>
            <Link
              to={mobile ? 'security/mobile' : 'security/mobile/bind'}
              className="form-button" onClick={this.banOld}
            >{mobile ? '修改' : '立即绑定'}</Link>
          </div>
          <div className="form-button-group">
            <div className="left-label">
              <span className="label-text">密码</span>
            </div>
            <Link to="security/password/edit" onClick={this.checkIdentify} className="form-button">修改</Link>
          </div>
          <div className="form-button-group">
            <div className="left-label">
              <span className="label-text">两步验证</span>
              <span className="form-info">{two_factor_enable ? '已绑定' : '未绑定'}</span>
            </div>
            <Link
              to={`security/2fa/${two_factor_enable ? 'unbind' : 'bind'}`}
              className="form-button" onClick={two_factor_enable ? this.cancleTFABind : this.checkIdentify}
            >
              {two_factor_enable ? '取消绑定' : '立即绑定'}
            </Link>
          </div>
        </div>
      </Main>
    );
  }
}

Index.propTypes = {
  server: PropTypes.any,
  dispatch: PropTypes.func,
};

Index.contextTypes = {
  router: () => PropTypes.func.isRequired,
};

export default Index;
