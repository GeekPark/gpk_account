import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import ReduxWrapper from '../ReduxWrapper';
import Header from '../share/Header';
import Avatar from '../share/Avatar';
import Message from '../share/Message';

import Tooltip from '../share/Tooltip';

import { showSuccessMessage } from '../../actions';
import { updateUser } from '../../share/server';
import { showXHRError } from '../../share/utils';
import { isValidNickname, isEmpty } from '../../share/validator';

class Welcome extends React.Component {
  constructor() {
    super();

    this.clearTip = () => this.refs.nicknameTip.clear();

    this.submit = e => {
      e.preventDefault();

      const { nickname } = this.refs;
      if (isEmpty(nickname.value)) {
        this.refs.nicknameTip.postErr('昵称不能为空');
        return;
      }

      if (!isValidNickname(nickname.value)) {
        this.refs.nicknameTip.postErr('昵称必须在 2-20 个字符喔');
        return;
      }

      updateUser({
        user: {
          nickname: nickname.value,
        },
      }).done(() => {
        this.props.dispatch(showSuccessMessage('更新成功, 自动跳转中...'));
        setTimeout(() => {
          window.location.href = this.props.data.callback_url;
        }, 3000);
      })
      .fail(xhr => showXHRError(xhr, this.props.dispatch));
    };
  }
  render() {
    const { callback_url } = this.props.data;
    return (
      <div className="component-welcome">
        <Header />
        <div className="component-welcome-container tac">
          <form className="w100p" onSubmit={this.submit}>
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
                <Avatar editable />
              </div>
              <div className="info-wrapper">
                <Tooltip ref="nicknameTip" className="mb-input">
                  <input type="text" placeholder="请输入你的昵称" onChange={this.clearTip} ref="nickname" />
                </Tooltip>
                <button className="btn btn-large">提交</button>
                <div className="tar go-setting">
                  <a href={callback_url}>跳过，稍后去帐号中心设置</a>
                </div>
              </div>
            </div>
          </form>
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
