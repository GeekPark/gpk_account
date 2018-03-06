import React, { PropTypes } from 'react';

import Tooltip from './Tooltip';

import { focus } from '../../share/utils';
import intl from 'react-intl-universal';

class Captcha extends React.Component {
  constructor() {
    super();

    this.state = {
      random: Math.random(),
    };

    this.clearTip = () => this.refs.tooltip.clear();

    this.random = () => {
      this.setState({ random: Math.random() });
      focus(this.refs.input);
    };

    this.getValue = () => {
      const v = this.refs.input.value;
      if (v.length === 0) {
        this.refs.tooltip.postErr(intl.get('验证码不能为空'));
        return false;
      }
      if (v.length !== 4) {
        this.refs.tooltip.postErr(intl.get('请输入4位数验证码'));
        return false;
      }
      return v;
    };
  }

  render() {
    return (
      <div className={`form-group ${this.props.className}`}>
        <Tooltip ref="tooltip">
          <input type="text" autoFocus={this.props.autofocus} placeholder={intl.get('图形验证码')} maxLength="4" ref="input" onChange={this.clearTip} />
        </Tooltip>
        <div className="form-side p0">
          <img src={`/rucaptcha?${this.state.random}`} alt={intl.get('验证码')} onClick={this.random} />
        </div>
      </div>
    );
  }
}

Captcha.defaultProps = {
  autofocus: false,
};

Captcha.propTypes = {
  className: PropTypes.string,
  autofocus: PropTypes.bool,
};

export default Captcha;
