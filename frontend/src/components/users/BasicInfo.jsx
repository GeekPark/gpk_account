import React, { PropTypes } from 'react';
import Avatar from '../share/Avatar';
import ChinaCity from '../share/ChinaCity';

class BasicInfo extends React.Component {
  render() {
    const { server, dispatch } = this.props;
    const { avatar_url, nickname, bio, company } = server.user;
    const year = new Date().getFullYear();
    return (
      <section className="section basic-info">
        <div className="section-title">
          基本资料
        </div>
        <div className="form-item">
          <label htmlFor="avatar">
            头像
          </label>

          <Avatar src={avatar_url} editable dispatch={dispatch} />
        </div>
        <div className="form-item">
          <label htmlFor="nickname">昵称*</label>
          <input type="text" defaultValue={nickname} />
        </div>
        <div className="form-item">
          <label htmlFor="realname">真实姓名</label>
          <input type="text" defaultValue="..." />
        </div>
        <div className="form-item">
          <label htmlFor="sex">性别</label>
          <select>
            <option value="其他" checked>其他</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div className="form-item">
          <label htmlFor="birthday">出生日期</label>
          <input type="date" defaultValue={`${year - 25}-01-01`} />
        </div>
        <div className="form-item">
          <label htmlFor="location">地区</label>
          <ChinaCity list={server.city} selected="110105" />
        </div>
        <div className="form-item">
          <label htmlFor="company" defaultValue={company}>公司</label>
          <input type="text" />
        </div>
        <div className="form-item">
          <label htmlFor="position">职位</label>
          <input type="text" />
        </div>
        <div className="form-item">
          <label htmlFor="bio">简介</label>
          <textarea defaultValue={bio} />
        </div>
        <div className="form-item">
          <label></label>
          <button className="btn btn-large limit-width">提交</button>
        </div>
      </section>
    );
  }
}

BasicInfo.propTypes = {
  dispatch: PropTypes.func,
  server: PropTypes.any,
};

export default BasicInfo;
