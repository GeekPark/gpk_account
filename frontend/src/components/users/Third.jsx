import React, { PropTypes } from 'react';

import Main from './Main';
import Item from './ThirdItem';

import { isSNS } from '../../share/utils';

class Third extends React.Component {
  render() {
    const { authorizations } = this.props.server.user;
    const weibo = authorizations.filter(x => x.provider === 'weibo')[0];
    const wechat = authorizations.filter(x => x.provider === 'wechat')[0];
    const snsUser = isSNS(this.props.server.user);
    const isOld = this.props.server.is_old;
    return (
      <Main title="第三方帐号" desc="可直接使用绑定的第三方帐号登录你的帐号">
        <div className="third-list">
          <Item type="wechat" isBind={wechat !== undefined} isOld={isOld} isSNS={snsUser} dispatch={this.props.dispatch} />
          <Item type="weibo" isBind={weibo !== undefined} isOld={isOld} isSNS={snsUser} dispatch={this.props.dispatch} />
        </div>
      </Main>
    );
  }
}

Third.propTypes = {
  server: PropTypes.any,
  dispatch: PropTypes.func,
};

export default Third;
