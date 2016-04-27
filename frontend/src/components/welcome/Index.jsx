import React from 'react';

import Header from '../share/Header';
import UploadAvatar from '../share/UploadAvatar';

class Welcome extends React.Component {
  render() {
    return (
      <div className="page-welcome">
        <Header />
        <div className="page-container tac">
          <div className="w100p">
            <div className="success-tip">
              <i className="iconfont icon-success"></i>
              <span className="tip-text">
                恭喜你成功注册极客公园帐号！
              </span>
            </div>
            <div className="welcome-desc">
              快来为你的帐号起个响亮的名字，配个帅气的头像吧！
            </div>
            <div className="user-info">
              <div className="avatar-wrapper">
                <UploadAvatar />
              </div>
              <div className="info-wrapper">
                <input type="text" placeholder="请输入你的昵称" className="mb-input" />
                <button className="btn btn-large">提交</button>
                <div className="tar go-setting">
                  <a href="/">跳过，稍后去账号中心设置</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Welcome;
