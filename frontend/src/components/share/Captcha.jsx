import React, { PropTypes } from 'react';

import Tooltip from './Tooltip';

class Captcha extends React.Component {
  constructor() {
    super();

    this.state = {
      random: Math.random(),
    };

    this.clearTip = () => this.refs.tooltip.clear();

    this.random = () => {
      this.setState({ random: Math.random() });
      this.refs.input.focus();
    };

    this.getValue = () => {
      const v = this.refs.input.value;
      if (v.length === 0) {
        this.refs.tooltip.postErr('验证码不能为空');
        return false;
      }
      return v;
    };
  }

  render() {
    return (
      <div className={`form-group ${this.props.className}`}>
        <Tooltip ref="tooltip">
          <input type="text" placeholder="图形验证码" maxLength="4" autoFocus ref="input" onChange={this.clearTip} />
        </Tooltip>
        <div className="form-side">
          <img src={`/rucaptcha?${this.state.random}`} alt="验证码" onClick={this.random} />
        </div>
      </div>
    );
  }
}

Captcha.propTypes = {
  className: PropTypes.string,
};

export default Captcha;
