import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Tooltip from './Tooltip';

import { isEmpty, isValidVerifyCode } from '../../share/validator';
import intl from 'react-intl-universal';

// NOTE: this component wrap by redux connect
// You should get ref by below code (eg: <VerifyCode ref="verifyCode">)
// this.refs.verifyCode.refs.wrappedInstance;
// the methods postErr,getValue,isPending,clearTip, shouldn't change name
// another method call it by ref.xxx(), so change before checked safe

class VerifyCode extends React.Component {
  constructor() {
    super();

    this.getValue = () => {
      const v = this.refs.input.value;
      const tip = this.refs.tip;
      if (isEmpty(v)) {
        tip.postErr(`请填写${this.typeStr()}收到的校验码`);
        return false;
      }
      if (!isValidVerifyCode(v)) {
        tip.postErr(intl.get('校验码必须为6位数数字'));
        return false;
      }
      return v;
    };

    this.isPending = () => this.props.verify_code.countdown > 0;
    this.clearTip = () => this.refs.tip.clear();
    this.postErr = msg => this.refs.tip.postErr(msg);

    this.getCode = () => {
      if (this.isPending()) return;
      this.props.onGetCode();
    };
  }

  typeStr() {
    return this.props.isEmail ? intl.get('邮箱') : intl.get('手机号');
  }

  render() {
    let verifyButtonText = intl.get('获取校验码');
    const { verify_code } = this.props;
    if (this.isPending()) verifyButtonText = `${intl.get('重新发送')}(${verify_code.countdown}s)`;
    else if (!verify_code.isFirst) verifyButtonText = intl.get('重新发送');

    const placeholder = this.props.isEmail ? intl.get('邮箱校验码') : intl.get('手机校验码');

    return (
      <Tooltip className="form-group mb-input" ref="tip">
        <div>
          <input
            type="text" ref="input" onChange={this.clearTip}
            placeholder={placeholder} maxLength="6"
            autoFocus={this.props.autofocus}
          />
          <div className="form-side" onClick={this.getCode}>
            {verifyButtonText}
          </div>
        </div>
      </Tooltip>
    );
  }
}

VerifyCode.defaultProps = {
  autofocus: false,
};

// access to redux, for know the pending status(verify_code)
// onGetCode for click getCodeBtn callback
VerifyCode.propTypes = {
  className: PropTypes.string,
  isEmail: PropTypes.bool,
  autofocus: PropTypes.bool,
  onGetCode: PropTypes.func.isRequired,
  verify_code: PropTypes.object.isRequired,
};

const mapStateToProps = ({ verify_code }, ownProps) => ({ verify_code, ...ownProps });
export default connect(mapStateToProps, null, null, { withRef: true })(VerifyCode);
