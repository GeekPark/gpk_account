import React, { PropTypes } from 'react';
const { func } = PropTypes;

import Captcha from '../../share/Captcha';
import Tooltip from '../../share/Tooltip';

import { isValidID, isEmpty } from '../../../share/validator';
import { validateCaptcha } from '../../../share/server';
import { parseErr } from '../../../share/utils';
import { showMessage } from '../../../actions';

class SendVerify extends React.Component {
  constructor() {
    super();

    this.clearTip = tipName => () => this.refs[tipName].clear();
    this.next = () => {
      const captchaValue = this.refs.captcha.getValue();
      if (!this.checkID() && !captchaValue) return;

      validateCaptcha({ str: captchaValue, user: { email: this.refs.id.value } })
        .done(() => {
          this.props.goPanel('new');
        })
        .fail(xhr => {
          const msg = parseErr(xhr.responseText);
          this.props.dispatch(showMessage({ type: 'error', msg }));
          this.refs.captcha.random();
        });
    };
  }

  checkID() {
    const { id, idTip } = this.refs;
    if (isEmpty(id.value)) {
      idTip.postErr('请填写手机号或邮箱');
      return false;
    }
    if (!isValidID(id.value)) {
      idTip.postErr('邮箱或手机号输错了吧');
      return false;
    }
    return true;
  }

  render() {
    return (
      <div>
        <Tooltip ref="idTip">
          <input type="text" placeholder="手机号码/邮箱" className="mb-input" ref="id" onChange={this.clearTip('idTip')} />
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
};


export default SendVerify;
