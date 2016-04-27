import React, { PropTypes } from 'react';

import { uploadAvatar } from '../../share/server';
import { showMessage } from '../../actions';

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
          .done(() => {
            const reader = new FileReader();
            reader.onload = ee => {
              this.refs.img.src = ee.target.result;
            };
            reader.readAsDataURL(files[0]);
            this.props.dispatch(showMessage({ type: 'success', msg: '头像更新成功' }));
          })
          .fail(xhr => {
            console.error(xhr);
          });
      }
    };
  }
  render() {
    const { editable, needhover, src } = this.props;
    return (
      <div className={`component-avatar ${editable ? 'editable' : ''} ${needhover ? 'needhover' : ''}`}>
        {
          !editable ? null :
          <div>
            <input type="file" onChange={this.upload} ref="input" />
            <div className="button-tip">上传头像</div>
          </div>
        }
        <img ref="img" src={src} alt="avatar" />
      </div>
    );
  }
}

Avatar.defaultProps = {
  needhover: false,
  editable: false,
  src: defaultIMG,
};

Avatar.propTypes = {
  editable: PropTypes.bool,
  needhover: PropTypes.bool,
  src: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};

export default Avatar;
