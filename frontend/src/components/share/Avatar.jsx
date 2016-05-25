import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import crop from 'crop-image';

import { tryKey, showXHRError } from '../../share/utils';
import { uploadAvatar } from '../../share/server';
import { showSuccessMessage, setStore } from '../../actions';

const defaultIMG = require('./default.jpg');

class Avatar extends React.Component {
  constructor() {
    super();

    this.upload = e => {
      const files = e.target.files;
      if (files && files[0]) {
        const image = new Image();

        image.onload = () => {
          // crop img first
          const { width, height } = image;
          const isHoriz = width > height;
          const minMax = isHoriz ? [height, width] : [width, height];
          const distance = minMax[1] - minMax[0];
          const CROP_SIZE = minMax[1] > 500 ? 500 : minMax[1];
          const blob = crop(image, isHoriz ? distance : 0, isHoriz ? 0 : distance, minMax[0], minMax[0], CROP_SIZE, CROP_SIZE);

          // send blob to server
          const f = new FormData();
          f.append('user[avatar]', new File([blob], files[0].name, { type: blob.type }));
          uploadAvatar(f)
            .done(user => {
              this.props.dispatch(setStore({ user }));
              this.props.dispatch(showSuccessMessage('头像更新成功'));
            })
            .fail(xhr => showXHRError(xhr, this.props.dispatch));
        };
        image.src = window.URL.createObjectURL(files[0]);
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
        <img ref="img" src={src || tryKey(server, 'user', 'avatar_url') || defaultIMG} alt="avatar" />
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
