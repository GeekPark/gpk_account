import React, { PropTypes } from 'react';

import Main from '../Main';
import Tooltip from '../../share/Tooltip';
import { get2FAQR, bind2FA } from '../../../share/server';
import { showSuccessMessage, showErrorMessage, setStore } from '../../../actions';
import { showXHRError } from '../../../share/utils';

const DESC = '使用两步验证工具（如 <a target="_blank" href="https://support.google.com/accounts/answer/1066447">Google Authenticator</a> 等）扫描下面的二维码，即可获取验证码 。';

class TFABind extends React.Component {
  constructor() {
    super();

    this.state = {
      qr: null,
    };

    this.clearTip = () => this.refs.tfaCodeTip.clear();

    this.submit = e => {
      e.preventDefault();
      const code = this.refs.tfaCode.value;
      if (code.length !== 6) {
        this.refs.tfaCodeTip.postErr('验证码必须为6位数字');
        return;
      }

      bind2FA(code)
        .done(user => {
          if (user.two_factor_enable) {
            this.props.dispatch(showSuccessMessage('两步验证绑定成功，跳转中...'));
            this.props.dispatch(setStore({ user }));
            setTimeout(() => {
              this.context.router.push('/security');
            }, 4000);
          } else {
            this.props.dispatch(showErrorMessage('验证码错误，请检查'));
          }
        })
        .fail(xhr => showXHRError(xhr, this.props.dispatch));
    };
  }
  componentWillMount() {
    get2FAQR().then(d => this.setState({ qr: d }));
  }
  render() {
    return (
      <Main title="绑定两步验证" needPadding desc={DESC} className="tfa">
        <form onSubmit={this.submit}>
          <div className="tfa-container">
            <img className="qr" src={this.state.qr || ''} alt="二维码载入中..." />
            <div className="qr-form">
              <div className="qr-form-desc">使用 Google 身份验证器扫描左边的二维码，即可获得验证码。</div>
              <Tooltip ref="tfaCodeTip" className="mb-input">
                <input type="text" ref="tfaCode" placeholder="验证码" maxLength="6" onChange={this.clearTip} autoFocus />
              </Tooltip>
              <button className="btn btn-large">立即绑定</button>
            </div>
          </div>
          <div className="bottom-link">
            <a className="link" target="_blank" href="https://www.google.com/landing/2step">为什么两步验证更安全</a>
          </div>
        </form>
      </Main>
    );
  }
}

TFABind.propTypes = {
  dispatch: PropTypes.func,
};

TFABind.contextTypes = {
  router: () => PropTypes.func.isRequired,
};

export default TFABind;
