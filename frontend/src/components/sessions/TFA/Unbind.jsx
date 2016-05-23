import React, { PropTypes } from 'react';
import IdentifyForm from '../../share/IdentifyForm';

import { showSuccessMessage } from '../../../actions';
import { showXHRError } from '../../../share/utils';
import { unbind2FA } from '../../../share/server';

class Unbind extends React.Component {
  constructor() {
    super();

    this.success = () => {
      unbind2FA()
        .done(() => {
          this.props.dispatch(showSuccessMessage('两部验证解绑成功，跳转中...'));
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        })
        .fail(xhr => showXHRError(xhr, this.props.dispatch));
    };
  }
  render() {
    return (
      <div>
        <div className="form-title">取消两部验证</div>
        <div className="form-desc">为了保证你的帐户安全，请验证身份后取消绑定两步验证</div>

        <IdentifyForm {...this.props} onSuccess={this.success} />
      </div>
    );
  }
}

Unbind.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default Unbind;
