import React, { PropTypes } from 'react';

import { showSuccessMessage, showErrorMessage, setStore } from '../../actions';
import { bindAccount, unbindAccount } from '../../share/server';
import { showXHRError } from '../../share/utils';

const convert = type => ({ weibo: '微博', wechat: '微信' })[type];

class ThirdItem extends React.Component {
  constructor() {
    super();

    this.onClick = e => {
      e.preventDefault();
      const { type, isBind, isSNS } = this.props;
      if (isSNS) {
        this.props.dispatch(showErrorMessage('请绑定邮箱或手机后再进行后续设置。'));
        setTimeout(() => {
          this.context.router.push('/security');
        }, 4000);
        return;
      }
      if (isBind) {
        unbindAccount(type)
          .done(user => {
            this.props.dispatch(showSuccessMessage(`${convert(type)}解绑成功`));
            this.props.dispatch(setStore({ user }));
          })
          .fail(xhr => showXHRError(xhr, this.props.dispatch));
      } else {
        bindAccount(type);
      }
    };
  }
  render() {
    const { type, isBind } = this.props;
    return (
      <div className="form-button-group">
        <div className="left-label">
          <span className="label-text">
            <i className={`iconfont icon-${type} ${isBind ? 'active' : ''}`}></i>
            {convert(type)}
          </span>
          <span className="provider-name">
            {isBind ? '已绑定' : '未绑定'}
          </span>
        </div>
        <a onClick={this.onClick} className="form-button">
          {isBind ? '取消绑定' : '立即绑定'}
        </a>
      </div>
    );
  }
}

ThirdItem.propTypes = {
  type: PropTypes.string.isRequired,
  isBind: PropTypes.bool.isRequired,
  isSNS: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

ThirdItem.contextTypes = {
  router: () => PropTypes.func.isRequired,
};

export default ThirdItem;
