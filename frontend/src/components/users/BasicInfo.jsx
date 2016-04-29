import React, { PropTypes } from 'react';
import ChinaCity from 'react-china-city';

import Avatar from '../share/Avatar';
import Tooltip from '../share/Tooltip';
import { initState, postErr, clearAllTip, hideTip } from '../../share/tooltip';

import { showMessage } from '../../actions';
import { updateUser } from '../../share/server';
import { parseErr } from '../../share/utils';

const TOOLTIPS = ['nickname'];

class BasicInfo extends React.Component {
  constructor() {
    super();

    this.state = {
      ...initState(TOOLTIPS),
    };

    this.postErr = postErr.bind(this);
    this.clearAllTip = clearAllTip.bind(this);
    this.hideTip = hideTip.bind(this);
    this.clearTip = tipName => this.hideTip.bind(this, tipName);


    this.submit = e => {
      e.preventDefault();
      if ($('input[name="user[nickname]"]').val().length === 0) {
        this.postErr('nickname', '昵称是必填项喔');
        return;
      }

      this.sendInfo();
    };
  }

  sendInfo() {
    const data = $('form#basic-info').serializeArray();
    updateUser(data)
      .done(() => {
        this.props.dispatch(showMessage({ type: 'success', msg: '个人信息更新成功' }));
      })
      .fail(xhr => {
        const msg = parseErr(xhr.responseText);
        if (msg) this.props.dispatch(showMessage({ type: 'error', msg }));
      });
  }

  render() {
    const { server } = this.props;
    const { nickname, bio, company, city } = server.user;
    const year = new Date().getFullYear();
    return (
      <form className="section basic-info" id="basic-info">
        <div className="section-title">
          基本资料
        </div>
        <div className="form-item">
          <label htmlFor="avatar">
            头像
          </label>

          <Avatar editable />
        </div>
        <div className="form-item">
          <label htmlFor="nickname">昵称*</label>
          <Tooltip info={this.state.tooltips.nickname}>
            <input type="text" defaultValue={nickname} name="user[nickname]" onChange={this.clearTip('nickname')} />
          </Tooltip>
        </div>
        <div className="form-item">
          <label htmlFor="realname">真实姓名</label>
          <input type="text" defaultValue="..." name="user[realname]" />
        </div>
        <div className="form-item">
          <label htmlFor="sex">性别</label>
          <select name="user[sex]">
            <option value="其他" checked>其他</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div className="form-item">
          <label htmlFor="birthday">出生日期</label>
          <input type="date" defaultValue={`${year - 25}-01-01`} name="user[birthday]" />
        </div>
        <div className="form-item">
          <label htmlFor="location">地区</label>
          <ChinaCity list={server.city} selected={city} />
        </div>
        <div className="form-item">
          <label htmlFor="company" defaultValue={company}>公司</label>
          <input type="text" name="user[company]" />
        </div>
        <div className="form-item">
          <label htmlFor="position">职位</label>
          <input type="text" name="user[position]" />
        </div>
        <div className="form-item">
          <label htmlFor="bio">简介</label>
          <textarea defaultValue={bio} name="user[bio]" />
        </div>
        <div className="form-item">
          <label></label>
          <button className="btn btn-large limit-width" onClick={this.submit}>提交</button>
        </div>
      </form>
    );
  }
}

BasicInfo.propTypes = {
  dispatch: PropTypes.func,
  server: PropTypes.any,
};

export default BasicInfo;
