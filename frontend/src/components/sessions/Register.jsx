import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import SocialLogin from './SocialLogin';
import PasswordInput from './PasswordInput';

import { isEmpty, isPhoneNumber, isEmail as isValidEmail } from '../../share/validator';
import { openModal, updateUser, resetVerify } from '../../actions';
import { createUser, notExist } from '../../share/server';
import { showXHRError, focus, changeTitle } from '../../share/utils';

import Tooltip from '../share/Tooltip';
import VerifyCode from '../share/VerifyCode';

import Welcome from '../welcome/Index';

const overlayStyle = {
  overlay: { backgroundColor: 'rgba(37, 37, 37, 0.7)' },
};

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmail: false,
      showValidate: true,
    };

    this.clearAllTip = () => {
      Object.keys(this.refs).forEach(x => {
        if (this.refs[x].isTooltip) this.refs[x].clear();
      });
    };
    this.clearTip = tipName => () => this.refs[tipName].clear();

    this.toggleType = () => {
      this.setState({ isEmail: !this.state.isEmail });
      this.clearAllTip();
      this.clearInput();
      this.props.dispatch(resetVerify());
      focus(this.refs.firstInput);
    };

    this.getCode = () => {
      const v = this.refs.firstInput.value;
      if (!this.isValidFirstInput()) return;
      notExist(v).then(this.getCodeLogic, () => {
        this.refs.firstInputTip.postErr('用户已存在');
      });
    };

    this.getCodeLogic = () => {
      this.getVerifyCodeInstance().clearTip();
      this.props.dispatch(updateUser({
        isEmail: this.state.isEmail,
        id: this.refs.firstInput.value,
      }));
      this.props.dispatch(openModal('ValidatorIMG', overlayStyle));
      this.clearAllTip();
    };

    this.submit = e => {
      e.preventDefault();
      if (!this.check()) return;
      const user = { password: this.getPwd() };
      const key = this.props.user.isEmail ? 'email' : 'mobile';
      user[key] = this.props.user.id;

      createUser({
        verify_code: this.getVerifyCodeInstance().getValue(),
        user,
      }).done(d => {
        const dom = document.querySelector('#component-session');
        ReactDOM.unmountComponentAtNode(dom);
        ReactDOM.render(<Welcome data={d} />, dom);
      }).fail(xhr => showXHRError(xhr, this.props.dispatch));
    };
  }

  componentWillMount() {
    changeTitle('注册');
  }

  getPwd() {
    return this.refs.password.getValue();
  }

  getVerifyCodeInstance() {
    return this.refs.verifyCode.refs.wrappedInstance;
  }

  typeStr() {
    return this.state.isEmail ? '邮箱' : '手机号';
  }

  clearInput() {
    Object.keys(this.refs).forEach(x => {
      if (/input/i.test(this.refs[x].nodeName)) this.refs[x].value = '';
    });
  }

  isValidFirstInput() {
    const { isEmail } = this.state;
    const { firstInput } = this.refs;
    const v = firstInput.value;
    const typeStr = this.typeStr();
    if (isEmpty(v)) {
      this.refs.firstInputTip.postErr(`${typeStr}不能为空`);
      focus(firstInput);
      return false;
    }
    if ((isEmail && !isValidEmail(v)) || (!isEmail && !isPhoneNumber(v))) {
      this.refs.firstInputTip.postErr(`${typeStr}格式不对`);
      focus(firstInput);
      return false;
    }
    return true;
  }

  check() {
    if (!this.isValidFirstInput()) return false;
    if (!this.props.user.isValidated) {
      this.getVerifyCodeInstance().postErr('请获取校验码并输入');
      return false;
    }
    if (!this.getVerifyCodeInstance().getValue()) return false;
    if (this.getPwd() === false) return false;
    return true;
  }

  render() {
    const { isEmail } = this.state;

    return (
      <form className="form-wrapper" onSubmit={this.submit} autoComplete="off" noValidate>
        <Tooltip className="mb-input" ref="firstInputTip">
          <input
            type="text" autoFocus ref="firstInput"
            placeholder={isEmail ? '邮箱' : '手机号码（仅支持中国大陆）'}
            maxLength={isEmail ? '100' : '11'}
            onChange={this.clearTip('firstInputTip')}
          />
        </Tooltip>
        <VerifyCode ref="verifyCode" onGetCode={this.getCode} isEmail={isEmail} />
        <PasswordInput placeholder="密码" ref="password" className="mb-input" />
        <button className="btn btn-large">立即注册</button>
        <div className="tar extra-info">
          <a className="link" href="javascript:;" onClick={this.toggleType} >
            {isEmail ? '使用手机注册' : '使用邮箱注册'}
          </a>
        </div>
        <SocialLogin {...this.props} />
      </form>
    );
  }
}

Register.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.object,
};

export default Register;
