import React, { PropTypes } from 'react';
const { func, string } = PropTypes;

import Captcha from '../../share/Captcha';
import Tooltip from '../../share/Tooltip';

import { isValidID, isEmpty, isEmail as isValidEmail } from '../../../share/validator';
import { sendVerify, notExist } from '../../../share/server';
import { showXHRError, focus } from '../../../share/utils';
import { sendVerifyCode, changeAvatar } from '../../../actions';

class SendVerify extends React.Component {
  constructor() {
    super();

    this.clearTip = tipName => () => this.refs[tipName].clear();
    this.next = e => {
      e.preventDefault();
      const captchaValue = this.refs.captcha.getValue();
      const id = this.getID();
      if (!id || !captchaValue) return;
      const isEmail = isValidEmail(id);

      notExist(id)
        .then(() => {
          this.refs.idTip.postErr('用户不存在');
          focus(this.refs.id);
        }).catch(() => {
          sendVerify({ str: captchaValue, id, isEmail })
          .done(() => {
            this.props.goPanel('new');
            this.props.changeLoginName(id);
            this.props.dispatch(sendVerifyCode());
          })
          .fail(xhr => {
            showXHRError(xhr, this.props.dispatch);
            this.refs.captcha.random();
          });
        });
    };

    this.onIDBlur = e => {
      if (e.target.value < 2) return;
      const v = this.getID();
      if (v === false) {
        this.props.dispatch(changeAvatar(null));
        return;
      }
      notExist(v)
        .then(() => {
          this.refs.idTip.postErr('用户不存在');
        })
        .catch(d => {
          this.props.dispatch(changeAvatar(d.avatar_url || null));
        });
    };
  }

  componentWillMount() {
    this.props.dispatch(changeAvatar(null));
  }

  getID() {
    const { id, idTip } = this.refs;
    if (isEmpty(id.value)) {
      idTip.postErr('请填写手机号或邮箱');
      return false;
    }
    if (!isValidID(id.value)) {
      idTip.postErr('邮箱或手机号不对喔');
      return false;
    }
    return id.value;
  }

  render() {
    const { loginName } = this.props;
    return (
      <form onSubmit={this.next}>
        <Tooltip ref="idTip">
          <input type="text" placeholder="手机号码/邮箱" className="mb-input" ref="id"
            defaultValue={loginName.length !== 0 ? loginName : ''}
            onChange={this.clearTip('idTip')} autoFocus
            onBlur={this.onIDBlur}
          />
        </Tooltip>
        <Captcha className="mb-input" ref="captcha" />
        <button className="btn btn-large">下一步</button>
      </form>
    );
  }
}

SendVerify.propTypes = {
  dispatch: func,
  goPanel: func,
  changeLoginName: func,
  loginName: string,
};


export default SendVerify;
