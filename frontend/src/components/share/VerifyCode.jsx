import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Tooltip from './Tooltip';

import { isEmpty, isValidVerifyCode } from '../../share/validator';

class VerifyCode extends React.Component {
  constructor() {
    super();

    this.state = {

    };

    this.getValue = () => {
      const v = this.refs.input.value;
      const tip = this.refs.tip;
      if (isEmpty(v)) {
        tip.postErr(`请填写${this.typeStr()}收到的验证码`);
        return false;
      }
      if (!isValidVerifyCode(v)) {
        tip.postErr('校验码必须为6位数数字');
        return false;
      }
      return true;
    };

    this.isPending = () => this.props.verify_code.countdown > 0;
    this.clearTip = () => this.refs.tip.clear();
    this.postErr = msg => this.refs.tip.postErr(msg);
  }

  typeStr() {
    return this.state.isEmail ? '邮箱' : '手机号';
  }

  render() {
    let verifyButtonText = '获取验证码';
    const { verify_code } = this.props;
    if (this.isPending()) verifyButtonText = `重新发送(${verify_code.countdown}s)`;
    else if (!verify_code.isFirst) verifyButtonText = '重新发送';

    return (
      <Tooltip className="form-group mb-input" ref="tip">
        <div>
          <input type="text" ref="input" onChange={this.clearTip}
            placeholder={this.props.isEmail ? '邮箱校验码' : '手机校验码'} maxLength="6"
          />
        <div className="form-side" onClick={this.props.onGetCode}>
            {verifyButtonText}
          </div>
        </div>
      </Tooltip>
    );
  }
}

// access to redux, for know the pending status(verify_code)
// onGetCode for click getCodeBtn callback
VerifyCode.propTypes = {
  className: PropTypes.string,
  isEmail: PropTypes.bool,
  onGetCode: PropTypes.func.isRequired,
  verify_code: PropTypes.object.isRequired,
};

const mapStateToProps = ({ verify_code }, ownProps) => ({ verify_code, ...ownProps });
export default connect(mapStateToProps, null, null, { withRef: true })(VerifyCode);
