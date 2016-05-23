import React from 'react';
import Tooltip from '../../share/Tooltip';

import { getCSRFToken } from '../../../share/utils';
import Unbind from './Unbind';

class TFA extends React.Component {
  constructor() {
    super();

    this.state = {
      panel: 'index',
    };

    this.clear = () => this.refs.tip.clear();

    this.submit = e => {
      const code = this.refs.code.value;
      if (code.length !== 6) {
        this.refs.tip.postErr('请输入六位数验证码');
        e.preventDefault();
        return;
      }
    };

    this.goUnbind = () => this.setState({ panel: 'unbind' });
  }

  render() {
    return (
      <form className="form-wrapper" action="/login" method="POST" onSubmit={this.submit}>
        <input type="hidden" className="hidden" name="authenticity_token" value={getCSRFToken()} />
        <div className="tal">
          <a href="/login" className="back-btn">
            <i className="iconfont icon-back"></i>
            <span>返回登录</span>
          </a>
        </div>
        {
          this.state.panel === 'unbind' ? <Unbind /> :
          <div>
            <div className="form-title">两部验证</div>
            <div className="form-desc">输入绑定的两步验证工具中的验证码</div>
            <Tooltip className="mb-input" ref="tip">
              <input type="text" ref="code" name="otp_code" onChange={this.clear} maxLength="6" />
            </Tooltip>
            <button className="btn btn-large">立即验证</button>
            <div className="tar extra-info">
              <a className="link" onClick={this.goUnbind}>无法获取验证码？</a>
            </div>
          </div>
        }
      </form>
    );
  }
}

export default TFA;
