import React, { PropTypes } from 'react';

import Main from '../Main';

const DESC = '使用 Google 身份验证器进行两步验证，你需要先安装<a target="_blank" href="https://support.google.com/accounts/answer/1066447">Google Authenticator</a>。';
const QR = 'data:image/png;base64,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';

class TFABind extends React.Component {
  render() {
    return (
      <Main title="两步验证 | 绑定" needPadding desc={DESC} className="tfa">
        <div>
          <div className="tfa-container">
            <img className="qr" src={QR} alt="qrcode for 2fa" />
            <div className="qr-form">
              <div className="qr-form-desc">使用 Google 身份验证器扫描左边的二维码，即可获得验证码。</div>
              <input type="text" ref="tfaCode" placeholder="验证码" className="mb-input" />
              <button className="btn btn-large">立即绑定</button>
            </div>
          </div>
          <div className="bottom-link">
            <a className="link" target="_blank" href="https://www.google.com/landing/2step">为什么两步验证更安全</a>
          </div>
        </div>
      </Main>
    );
  }
}

TFABind.propTypes = {
  dispatch: PropTypes.func,
};

export default TFABind;
