import React, { PropTypes } from 'react';

import Main from './Main';

class Third extends React.Component {
  render() {
    return (
      <Main title="第三方帐号" desc="可直接使用绑定的第三方帐号登录你的帐号">
        <div className="third-list">
          <div className="form-button-group">
            <div className="left-label">
              <span className="label-text">
                <i className="iconfont icon-wechat"></i>
                微信
              </span>
              <span className="provider-name">未绑定</span>
            </div>
            <a href="/auth/wechat" className="form-button">立即绑定</a>
          </div>
          <div className="form-button-group">
            <div className="left-label">
              <span className="label-text">
                <i className="iconfont icon-weibo"></i>
                微博
              </span>
              <span className="provider-name">未绑定</span>
            </div>
            <a href="javascript:;" className="form-button">立即绑定</a>
          </div>
        </div>
      </Main>
    );
  }
}

Third.propTypes = {
  server: PropTypes.any,
};

export default Third;
