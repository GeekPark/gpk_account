import React, { PropTypes } from 'react';

import Main from '../Main';
import IdentifyForm from '../../share/IdentifyForm';

import { showSuccessMessage } from '../../../actions';

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
  }
  render() {
    return (
      <Main
        needPadding isCenter className="identify-wrapper"
        title="验证身份" desc="为了保证你的帐户安全，在继续操作之前请验证身份。"
      >
        <IdentifyForm onSuccess={this.success} {...this.props} />
      </Main>
    );
  }
}

Identify.propTypes = {
  redirect: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
};

Identify.contextTypes = {
  router: () => PropTypes.func.isRequired,
};

export default Identify;
