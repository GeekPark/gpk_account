import React, { PropTypes } from 'react';

class PasswordInput extends React.Component {
  constructor() {
    super();

    this.state = {
      inputType: 'password',
    };

    this.toggleType = () => {
      this.setState({ inputType: this.state.inputType === 'password' ? 'text' : 'password' });
      this.refs.input.focus();
    };
  }

  render() {
    return (
      <div className={`form-group ${this.props.className}`}>
        <input type={this.state.inputType} placeholder={this.props.placeholder} ref="input" onChange={this.props.onChange} />
        <div className="form-side" onClick={this.toggleType}>
          <i className={`iconfont icon-eye ${this.state.inputType === 'text' ? 'active' : ''}`}></i>
        </div>
      </div>
    );
  }
}

PasswordInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

export default PasswordInput;
