import React, { PropTypes } from 'react';
const { func } = PropTypes;

import Captcha from '../../share/Captcha';
import Tooltip from '../../share/Tooltip';

import { isValidID, isEmpty, isEmail as isValidEmail } from '../../../share/validator';
import * as SERVER from '../../../share/server';
import { parseErr } from '../../../share/utils';
import { showMessage, sendVerifyCode } from '../../../actions';

class SendVerify extends React.Component {
  constructor() {
    super();

    this.clearTip = tipName => () => this.refs[tipName].clear();
    this.next = () => {
      const captchaValue = this.refs.captcha.getValue();
      const id = this.getID();
      if (!id || !captchaValue) return;
      const isEmail = isValidEmail(id);
      const user = isEmail ? { email: id } : { mobile: id };

      SERVER.checkExist(id)
        .then(() => {
          this.refs.idTip.postErr('用户不存在');
          this.refs.id.focus();
        }).catch(() => {
          // catch meaning the user was exist!
          SERVER.sendVerify({ str: captchaValue, user, isEmail })
          .done(() => {
            this.props.goPanel('new');
            this.props.changeLoginName(id);
            this.props.dispatch(sendVerifyCode());
          })
          .fail(xhr => {
            const msg = parseErr(xhr.responseText);
            this.props.dispatch(showMessage({ type: 'error', msg }));
            this.refs.captcha.random();
          });
        });
    };
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
    return (
      <div>
        <Tooltip ref="idTip">
          <input type="text" placeholder="手机号码/邮箱" className="mb-input" ref="id"
            onChange={this.clearTip('idTip')} autoFocus
          />
        </Tooltip>
        <Captcha className="mb-input" ref="captcha" />
        <button onClick={this.next} className="btn btn-large">下一步</button>
      </div>
    );
  }
}

SendVerify.propTypes = {
  dispatch: func,
  goPanel: func,
  changeLoginName: func,
};


export default SendVerify;
