import React, { PropTypes } from 'react';
import Tooltip from '../Tooltip';

import { validateCaptcha } from '../../share/server';

class ValidatorIMG extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      random: Math.random(),
      tipInfo: {
        isShow: false,
        msg: '验证码不正确',
        type: 'error',
      },
    };

    this.random = () => {
      this.setState({ random: Math.random() });
      this.refs.input.focus();
    };

    this.validate = () => {
      const v = this.refs.input.value;

      if (v.length !== 4) {
        this.showErr();
        return;
      }

      const user = {};
      const key = props.user.isEmail ? 'email' : 'mobile';
      user[key] = props.user.id;

      validateCaptcha({ str: v, user })
        .done(() => {
          this.props.onClose();
          this.props.sendVerifyCode();
        })
        .fail(() => {
          this.showErr();
        });
    };

    this.clearTip = () => this.setState({ tipInfo: { ...this.state.tipInfo, isShow: false } });
  }

  showErr() {
    this.setState({ tipInfo: { ...this.state.tipInfo, isShow: true } });
  }

  render() {
    const { tipInfo } = this.state;
    return (
      <div>
        <div className="modal-title">
          请输入下面的图形验证码
        </div>
        <i className="iconfont icon-close modal-close" onClick={this.props.onClose}></i>
        <div className="form-group mb-input">
          <Tooltip info={tipInfo}>
            <div>
              <input type="text" placeholder="图形验证码" maxLength="4" autoFocus ref="input" onChange={this.clearTip} />
              <div className="form-side">
                <img src={`/rucaptcha?${this.state.random}`} alt="验证码" onClick={this.random} />
              </div>
            </div>
          </Tooltip>
        </div>
        <button className="btn btn-large" onClick={this.validate}>提交</button>
      </div>
    );
  }
}

ValidatorIMG.propTypes = {
  user: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  sendVerifyCode: PropTypes.func.isRequired,
};

export default ValidatorIMG;
