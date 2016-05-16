import React, { PropTypes } from 'react';
import ChinaCity from 'react-china-city';

import Avatar from '../share/Avatar';
import Tooltip from '../share/Tooltip';
import Select from '../share/Select';

import { showSuccessMessage } from '../../actions';
import { updateUser } from '../../share/server';
import { showXHRError } from '../../share/utils';
import { isValidBirthday, isValidNickname } from '../../share/validator';

import Main from './Main';

class BasicInfo extends React.Component {
  constructor() {
    super();

    this.clearTip = tipName => () => this.refs[tipName].clear();

    this.submit = e => {
      e.preventDefault();
      if (!isValidNickname(
        $('input[name="user[nickname]"]').val()
      )) {
        this.refs.nicknameTip.postErr('昵称必须在 2-20 个字符喔');
        return;
      }

      if (!isValidBirthday(
          $('input[name="user[birthday]"]').val()
      )) {
        this.refs.birthdayTip.postErr('请填写正确的出生日期');
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
        this.props.dispatch(showSuccessMessage('个人信息更新成功'));
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

            <Avatar editable size={80} />
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
            <Select name="user[gender]" value={gender}
              options={[
                ['not_sure', '其他'], ['male', '男'], ['female', '女'],
              ]}
            />
          </div>
          <div className="form-item">
            <label htmlFor="birthday">出生日期</label>
            <Tooltip ref="birthdayTip">
              <input type="date" defaultValue={birthday || `${year - 25}-01-01`} name="user[birthday]" onChange={this.clearTip('birthdayTip')} />
            </Tooltip>
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
