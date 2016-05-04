import React, { PropTypes } from 'react';

import PasswordInput from '../../sessions/PasswordInput';
import Main from '../Main';
import { updatePassword } from '../../../share/server';
import { showXHRError } from '../../../share/utils';

class PasswordEdit extends React.Component {
  constructor() {
    super();

    this.submit = () => {
      const password = this.refs.old.getValue();
      if (password === false) return;
      const new_password = this.refs.new.getValue();
      if (new_password === false) return;

      updatePassword({ password, new_password })
        .done(d => {
          // TODO: password edit with backend
          console.log(d);
        }).fail(xhr => showXHRError(xhr, this.props.dispatch));
    };
  }
  render() {
    return (
      <Main needPadding title="修改密码" isCenter>
        <div>
          <PasswordInput placeholder="原密码" autofocus className="mb-input" ref="old" />
          <PasswordInput placeholder="新密码" className="mb-input" ref="new" />
          <button className="btn btn-large" onClick={this.submit}>修改密码</button>
        </div>
      </Main>
    );
  }
}

PasswordEdit.propTypes = {
  dispatch: PropTypes.func,
};

export default PasswordEdit;
