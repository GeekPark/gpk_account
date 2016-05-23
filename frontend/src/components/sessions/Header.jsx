import React, { PropTypes } from 'react';
import { Motion, spring, presets } from 'react-motion';
import { Link } from 'react-router';

import { changeAvatar } from '../../actions';

const PRESET = presets.wobbly;
const BLUR = '?imageMogr2/blur/50x8';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      source: props.avatarURL,
      loaded: null,
    };

    this.resetAvatar = () => this.props.dispatch(changeAvatar(null));
  }
  componentWillReceiveProps(nextProps) {
    if (this.props === nextProps) return;
    if (nextProps.avatarURL === null) {
      this.setState({ loaded: null });
      return;
    }

    const newImage = new Image();
    newImage.onload = () => this.setState({ loaded: nextProps.avatarURL });
    newImage.src = `${nextProps.avatarURL}${BLUR}`;
  }
  hideSwitch() {
    const url = window.location.href;
    return /reset_password/.test(url) || /two_factor_verify/.test(url);
  }
  render() {
    const loaded = this.state.loaded;
    const avatar = {};
    if (loaded !== null) {
      avatar.backgroundImage = `url(${loaded})`;
    }

    return (
      <div className="header-wrapper">
        <div className="logo-wrapper">
          <Motion defaultStyle={{ op: 1 }} style={{ op: spring(loaded === null ? 1 : 0), PRESET }}>
            { s => <a href="//www.geekpark.net" className="logo" style={{ opacity: s.op }}></a>}
          </Motion>
          <Motion defaultStyle={{ op: 0 }} style={{ op: spring(loaded === null ? 0 : 1), PRESET }}>
            { s =>
              <div className="avatar-wrapper" style={{ backgroundImage: loaded === null ? 'none' : `url(${loaded + BLUR})` }}>
                <div className="avatar-mask" style={{ ...avatar, opacity: s.op, transform: 'scale(1.8)' }}></div>
              </div>
            }
          </Motion>
        </div>
        {
          this.hideSwitch() ? null :
          <div className="form-wrapper switch-button">
            <Link to="login" onClick={this.resetAvatar} activeClassName="active">登录</Link>
            <Link to="signup" onClick={this.resetAvatar} activeClassName="active">注册</Link>
          </div>
        }
      </div>
    );
  }
}

Header.propTypes = {
  avatarURL: PropTypes.any,
  dispatch: PropTypes.func.isRequired,
};

export default Header;
