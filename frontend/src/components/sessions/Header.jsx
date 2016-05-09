import React, { PropTypes } from 'react';
import { Motion, spring, presets } from 'react-motion';
import { Link } from 'react-router';

const PRESET = presets.wobbly;
const DEVBG = 'url(https://dn-geekpark-new.qbox.me/uploads/user/avatar/000/212/439/6a24809ee6c70b34c0a4a2b359013b50.png?imageMogr2/blur/50x8)';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      source: props.avatarURL,
      loaded: null,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props === nextProps) return;
    if (nextProps.avatarURL === null) {
      this.setState({ loaded: null });
      return;
    }

    const newImage = new Image();
    newImage.onload = () => this.setState({ loaded: nextProps.avatarURL });
    newImage.src = `${nextProps.avatarURL}?imageMogr2/blur/50x8`;
  }
  render() {
    const loaded = this.state.loaded;
    const styles = { wrapper: {}, avatar: { } };
    if (loaded !== null) {
      styles.wrapper.backgroundImage = ISDEV ? DEVBG : `url(${loaded})?imageMogr2/blur/50x8`;
      styles.avatar.backgroundImage = `url(${loaded})`;
    }

    return (
      <div className="header-wrapper">
        <div className="logo-wrapper" style={styles.wrapper}>
          <Motion defaultStyle={{ scale: 1 }} style={{ scale: spring(loaded === null ? 1 : 0), PRESET }}>
            { s => <a href="//www.geekpark.net" className="logo" style={{ transform: `scale(${s.scale})` }}></a>}
          </Motion>
          <Motion defaultStyle={{ scale: 0 }} style={{ scale: spring(loaded === null ? 0 : 1.8), PRESET }}>
            { s => <div className="avatar-mask" style={{ ...styles.avatar, transform: `scale(${s.scale})` }}></div>}
          </Motion>
        </div>
        <div className="form-wrapper switch-button">
          <Link to="login" activeClassName="active">登录</Link>
          <Link to="signup" activeClassName="active">注册</Link>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  avatarURL: PropTypes.any,
};

export default Header;
