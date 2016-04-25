import React, { PropTypes } from 'react';

class ValidatorIMG extends React.Component {
  constructor() {
    super();

    this.state = {
      random: Math.random(),
    };

    this.random = () => this.setState({ random: Math.random() });
  }
  render() {
    return (
      <div>
        <div className="modal-title">
          请输入下面的图形验证码
        </div>
        <i className="iconfont icon-close modal-close" onClick={this.props.onClose}></i>
        <div className="form-group">
          <input type="text" placeholder="图形验证码" maxLength="4" autoFocus />
          <div className="form-side">
            <img src={`/rucaptcha?${this.state.random}`} alt="验证码" onClick={this.random} />
          </div>
          <button className="btn btn-large">提交</button>
        </div>
      </div>
    );
  }
}

ValidatorIMG.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ValidatorIMG;
