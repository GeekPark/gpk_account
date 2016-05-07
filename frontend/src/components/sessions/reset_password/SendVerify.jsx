import React, { PropTypes } from 'react';
const { func } = PropTypes;

import Captcha from '../../share/Captcha';
import Tooltip from '../../share/Tooltip';

import { isValidID, isEmpty, isEmail as isValidEmail } from '../../../share/validator';
import { sendVerify, notExist } from '../../../share/server';
import { showXHRError } from '../../../share/utils';
import { sendVerifyCode } from '../../../actions';

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
          this.refs.id.focus();
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
      <form onSubmit={this.next}>
        <Tooltip ref="idTip">
          <input type="text" placeholder="手机号码/邮箱" className="mb-input" ref="id"
            onChange={this.clearTip('idTip')} autoFocus
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
};


export default SendVerify;
