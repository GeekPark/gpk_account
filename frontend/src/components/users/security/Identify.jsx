import React, { PropTypes } from 'react';

import Main from '../Main';
import IdentifyForm from '../../share/IdentifyForm';

import { showSuccessMessage, setStore } from '../../../actions';
import { tryKey, showXHRError } from '../../../share/utils';
import { unbind2FA } from '../../../share/server';

class Identify extends React.Component {
  constructor() {
    super();

    this.success = () => {
      this.props.dispatch(showSuccessMessage('校验成功，自动跳转中...'));

      setTimeout(() => {
        if (this.props.redirect) {
          this.context.router.push('/security');
        } else {
          window.location.reload(true);
        }
      }, 3000);
    };

    this.tfaSuccess = () => {
      unbind2FA()
        .done(user => {
          this.props.dispatch(showSuccessMessage('两步验证解绑成功, 跳转中...'));
          this.props.dispatch(setStore({ user }));

          setTimeout(() => {
            this.context.router.push('/security');
          }, 3500);
        })
        .fail(xhr => showXHRError(xhr, this.props.dispatch));
    };
  }
  render() {
    const isTFA = tryKey(this.props, 'location', 'state', 'isTFA') === true;

    const title = isTFA ? '取消绑定两步验证 | 验证身份' : '验证身份';
    const desc = isTFA ? '为了保证你的帐户安全，请验证身份后取消绑定两步验证。' : '为了保证你的帐户安全，在继续操作之前请验证身份。';

    const handleClick = isTFA ? this.tfaSuccess : this.success;

    return (
      <Main
        needPadding isCenter className="identify-wrapper"
        title={title} desc={desc}
      >
        <IdentifyForm
          onSuccess={handleClick} {...this.props}
          buttonText={isTFA ? '验证身份并取消绑定' : ''}
        />
      </Main>
    );
  }
}

Identify.propTypes = {
  redirect: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.object,
};

Identify.contextTypes = {
  router: () => PropTypes.func.isRequired,
};

export default Identify;
