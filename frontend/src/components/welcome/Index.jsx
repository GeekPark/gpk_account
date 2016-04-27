import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import ReduxWrapper from '../ReduxWrapper';
import Header from '../share/Header';
import Avatar from '../share/Avatar';
import Message from '../share/Message';

import Tooltip from '../Tooltip';
import { initState, postErr, clearAllTip, hideTip } from '../../share/tooltip';

import { showMessage } from '../../actions';
import { updateUser } from '../../share/server';

class Welcome extends React.Component {
  constructor() {
    super();

    this.state = { ...initState(['nickname']) };

    this.postErr = postErr.bind(this);
    this.hideTip = hideTip.bind(this);
    this.clearAllTip = clearAllTip.bind(this);
    this.clearTip = tipName => this.hideTip.bind(this, tipName);


    this.submit = () => {
      const { nickname } = this.refs;
      if (nickname.value.length === 0) {
        this.postErr('nickname', '昵称不能为空');
        return;
      }

      updateUser({
        user: {
          nickname: nickname.value,
        },
      }).done(d => {
        console.log(d);
        this.props.dispatch(showMessage({ type: 'success', msg: '更新成功, 自动跳转中...' }));
      }).fail(xhr => {
        console.error(xhr);
      });
    };
  }
  render() {
    const { callback_url } = this.props.data;
    return (
      <div className="component-welcome">
        <Header />
        <div className="component-welcome-container tac">
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
                <Avatar ref="avatar" editable />
              </div>
              <div className="info-wrapper">
                <Tooltip info={this.state.tooltips.nickname} className="mb-input">
                  <input type="text" placeholder="请输入你的昵称" onChange={this.clearTip('nickname')} ref="nickname" />
                </Tooltip>
                <button className="btn btn-large" onClick={this.submit}>提交</button>
                <div className="tar go-setting">
                  <a href={callback_url}>跳过，稍后去帐号中心设置</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Welcome.propTypes = {
  data: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const Components = props => (
  <div>
    <Welcome {...props} />
    <Message {...props} />
  </div>
);

const mapStateToProps = (state, ownProps) => ({ ...state, ...ownProps });
const ConnectWelcome = connect(mapStateToProps)(Components);

const WelcomeWrapper = props => (
  <ReduxWrapper>
    <ConnectWelcome {...props} />
  </ReduxWrapper>
);

export default WelcomeWrapper;
