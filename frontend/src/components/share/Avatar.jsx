import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { tryKey } from '../../share/utils';
import { uploadAvatar } from '../../share/server';
import { showMessage, setStore } from '../../actions';

const defaultIMG = require('./default.png');

class Avatar extends React.Component {
  constructor() {
    super();

    this.upload = e => {
      const files = e.target.files;
      if (files && files[0]) {
        // upload to server
        const f = new FormData();
        f.append('user[avatar]', files[0]);
        uploadAvatar(f)
          .done(user => {
            const { server } = this.props;
            this.props.dispatch(showMessage({ type: 'success', msg: '头像更新成功' }));
            this.props.dispatch(setStore({ ...server, user }));
          })
          .fail(xhr => {
            console.error(xhr);
          });
      }
    };
  }
  render() {
    const { size, server, editable, needhover, src } = this.props;

    return (
      <div
        style={{ width: size, height: size }}
        className={`component-avatar ${editable ? 'editable' : ''} ${needhover ? 'needhover' : ''}`}
      >
        {
          !editable ? null :
          <div>
            <input type="file" onChange={this.upload} ref="input" />
            <div className="button-tip">上传头像</div>
          </div>
        }
        <img ref="img" src={src || tryKey(server, 'user', 'avatar_url') || defaultIMG } alt="avatar" />
      </div>
    );
  }
}

Avatar.defaultProps = {
  needhover: false,
  editable: false,
};

Avatar.propTypes = {
  editable: PropTypes.bool,
  needhover: PropTypes.bool,
  src: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  server: PropTypes.any,
  size: PropTypes.number,
};

const mapStateToProps = state => {
  const { server } = state;
  return { server };
};

export default connect(mapStateToProps)(Avatar);
