import React, { PropTypes } from 'react';
import ChinaCity from 'react-china-city';

import Avatar from '../share/Avatar';
import Tooltip from '../share/Tooltip';

import { showMessage } from '../../actions';
import { updateUser } from '../../share/server';
import { showXHRError } from '../../share/utils';

import Main from './Main';

class BasicInfo extends React.Component {
  constructor() {
    super();

    this.clearTip = tipName => () => this.refs[tipName].clear();

    this.submit = e => {
      e.preventDefault();
      if ($('input[name="user[nickname]"]').val().length === 0) {
        this.refs.nicknameTip.postErr('昵称是必填项喔');
        return;
      }

      this.sendInfo();
    };
  }

  sendInfo() {
    const data = $('form#basic-info').serializeArray().map(x => {
      if (x.name === 'user[city]' && +x.value === 0) return {};
      else return x;
    });
    updateUser(data)
      .done(() => {
        this.props.dispatch(showMessage({ type: 'success', msg: '个人信息更新成功' }));
      })
      .fail(xhr => showXHRError(xhr, this.props.dispatch));
  }

  render() {
    const { server } = this.props;
    const { nickname, realname, bio, company, city, birthday, title, gender } = server.user;
    const year = new Date().getFullYear();
    return (
      <Main className="basic-info" title="基本资料" needPadding>
        <form id="basic-info">
          <div className="form-item">
            <label htmlFor="avatar">
              头像
            </label>

            <Avatar editable />
          </div>
          <div className="form-item">
            <label htmlFor="nickname">昵称*</label>
            <Tooltip ref="nicknameTip">
              <input type="text" defaultValue={nickname} name="user[nickname]" onChange={this.clearTip('nicknameTip')} />
            </Tooltip>
          </div>
          <div className="form-item">
            <label htmlFor="realname">真实姓名</label>
            <input type="text" defaultValue={realname} name="user[realname]" />
          </div>
          <div className="form-item">
            <label htmlFor="sex">性别</label>
            <select name="user[gender]" defaultValue={gender}>
              <option value="not_sure" checked>其他</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>
          <div className="form-item">
            <label htmlFor="birthday">出生日期</label>
            <input type="date" defaultValue={birthday || `${year - 25}-01-01`} name="user[birthday]" />
          </div>
          <div className="form-item">
            <label htmlFor="location">地区</label>
            <ChinaCity list={server.city} selected={city} />
          </div>
          <div className="form-item">
            <label htmlFor="company">公司</label>
            <input type="text" name="user[company]" defaultValue={company} />
          </div>
          <div className="form-item">
            <label htmlFor="position">职位</label>
            <input type="text" name="user[title]" defaultValue={title} />
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
      </Main>
    );
  }
}

BasicInfo.propTypes = {
  dispatch: PropTypes.func,
  server: PropTypes.any,
};

export default BasicInfo;
