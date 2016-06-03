import React, { PropTypes } from 'react';
import deepAssign from 'deep-assign';

import Main from './Main';
import ListItem from './ListItem';

import { setStore, showSuccessMessage, showErrorMessage } from '../../actions';
import { updateEmailPreference } from '../../share/server';
import { tryKey, showXHRError } from '../../share/utils';

const SUBSCRIBED = 'subscribed';
const UNSUBSCRIBED = 'unsubscribed';

const readSetting = (perference, key) => {
  const result = tryKey(perference, 'email', 'subscriptions', key);
  return result === false || result === SUBSCRIBED;
};

class Subscribe extends React.Component {
  constructor(props) {
    super(props);

    this.isOld = this.props.server.user.is_old;
    this.isInvaliedEmail = this.props.server.user.email === null;

    this.onClickReport = this.onClick.bind(this, 'report');
    this.onClickEvent = this.onClick.bind(this, 'event');
  }
  onClick(name) {
    const { dispatch, server } = this.props;

    if (this.isOld || this.isInvaliedEmail) {
      const msg = this.isOld ? '请验证邮箱后再进行后续设置。' : '请绑定邮箱后再进行后续设置。';

      dispatch(showErrorMessage(msg));
      setTimeout(() => {
        this.context.router.push('/security');
      }, 4000);
      return;
    }

    const { preference } = server.user;
    const isSubscribe = this.readStatus(name);

    const newPreference = {
      email: {
        subscriptions: {
          [name]: isSubscribe ? UNSUBSCRIBED : SUBSCRIBED,
        },
      },
    };

    updateEmailPreference({ preference: deepAssign({}, preference, newPreference) })
      .done(user => {
        dispatch(setStore({ user }));
        dispatch(showSuccessMessage(`${isSubscribe ? '取消' : ''}订阅成功`));
      })
      .fail(xhr => showXHRError(xhr, dispatch));
  }
  readStatus(key) {
    if (this.isOld || this.isInvaliedEmail) return false;
    return readSetting(this.props.server.user.preference, key);
  }
  render() {
    return (
      <Main title="邮件订阅">
        <div className="email-subscribe">
          <ListItem name="产业报告" buttonText={this.readStatus('report') ? '取消订阅' : '订阅'} onClick={this.onClickReport} />
          <ListItem name="活动资讯" buttonText={this.readStatus('event') ? '取消订阅' : '订阅'} onClick={this.onClickEvent} />
        </div>
      </Main>
    );
  }
}

Subscribe.propTypes = {
  server: PropTypes.any,
  dispatch: PropTypes.func,
};

Subscribe.contextTypes = {
  router: () => PropTypes.func.isRequired,
};

export default Subscribe;
