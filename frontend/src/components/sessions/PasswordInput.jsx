import React, { PropTypes } from 'react';
import Tooltip from '../share/Tooltip';

import { isEmpty, isValidPassword } from '../../share/validator';
import { focus } from '../../share/utils';

class PasswordInput extends React.Component {
  constructor() {
    super();

    this.state = {
      inputType: 'password',
    };

    this.toggleType = () => {
      this.setState({ inputType: this.state.inputType === 'password' ? 'text' : 'password' });
      focus(this.refs.input);
    };

    this.getValue = () => {
      const v = this.refs.input.value;
      const { tip, input } = this.refs;
      if (isEmpty(v)) {
        tip.postErr('请填写密码');
        focus(input);
        return false;
      }
      if (!isValidPassword(v)) {
        tip.postErr('密码必须在 6-20 位');
        focus(input);
        return false;
      }
      return v;
    };

    this.clearTip = () => this.refs.tip.clear();
  }

  render() {
    return (
      <Tooltip ref="tip">
        <div className={`form-group ${this.props.className}`}>
          <input type={this.state.inputType} placeholder={this.props.placeholder}
            ref="input" onChange={this.clearTip} maxLength="20" minLength="6" autoFocus={this.props.autofocus}
          />
          <div className="form-side" onClick={this.toggleType}>
            <i className={`iconfont icon-eye ${this.state.inputType === 'text' ? 'active' : ''}`}></i>
          </div>
        </div>
      </Tooltip>
    );
  }
}

PasswordInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  className: PropTypes.string,
  autofocus: PropTypes.bool,
};

export default PasswordInput;
