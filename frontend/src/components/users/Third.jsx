import React, { PropTypes } from 'react';

import Main from './Main';

const Item = ({ type, isBind }) => (
  <div className="form-button-group">
    <div className="left-label">
      <span className="label-text">
        <i className={`iconfont icon-${type} ${isBind ? 'active' : ''}`}></i>
        微博
      </span>
      <span className="provider-name">
        { isBind ? '已绑定' : '未绑定' }
      </span>
    </div>
    <a href={`/auth/${type}${isBind ? '/unbind' : ''}`} data-method="DELETE" className="form-button">
      { isBind ? '取消绑定' : '立即绑定' }
    </a>
  </div>
);

Item.propTypes = {
  type: PropTypes.string.isRequired,
  isBind: PropTypes.bool.isRequired,
};

class Third extends React.Component {
  render() {
    const { authorizations } = this.props.server.user;
    const weibo = authorizations.filter(x => x.provider === 'weibo')[0];
    const wechat = authorizations.filter(x => x.provider === 'wechat')[0];
    return (
      <Main title="第三方帐号" desc="可直接使用绑定的第三方帐号登录你的帐号">
        <div className="third-list">
          <Item type="wechat" isBind={wechat !== undefined} />
          <Item type="weibo" isBind={weibo !== undefined} />
        </div>
      </Main>
    );
  }
}

Third.propTypes = {
  server: PropTypes.any,
};

export default Third;
