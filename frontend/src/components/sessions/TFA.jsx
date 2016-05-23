import React from 'react';
import Tooltip from '../share/Tooltip';

import { getCSRFToken } from '../../share/utils';

class TFA extends React.Component {
  constructor() {
    super();

    this.clear = () => this.refs.tip.clear();

    this.submit = e => {
      const code = this.refs.code.value;
      if (code.length !== 6) {
        this.refs.tip.postErr('请输入六位数验证码');
        e.preventDefault();
        return;
      }
    };
  }
  render() {
    return (
      <form className="form-wrapper" action="/login" method="POST" onSubmit={this.submit}>
        <input type="hidden" className="hidden" name="authenticity_token" value={getCSRFToken()} />
        <h2>
          两部验证输入框
        </h2>
        <Tooltip className="mb-input" ref="tip">
          <input type="text" ref="code" name="otp_code" onChange={this.clear} maxLength="6" />
        </Tooltip>
        <button className="btn btn-large">立即验证</button>
      </form>
    );
  }
}

export default TFA;
