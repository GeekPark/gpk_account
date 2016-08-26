import moment from 'moment';
import React, { PropTypes } from 'react';
import { Table } from 'antd';
import { fetchBroadcasts } from '../../../share/server';

const columns = [
  { title: '类型', dataIndex: 'content_type', key: 'content_type' },
  { title: '内容', dataIndex: 'content', key: 'content' },
  { title: '创建时间', dataIndex: 'created_at', key: 'created_at' },
  { title: '发送时间', dataIndex: 'send_at', key: 'send_at' },
  { title: '操作', dataIndex: 'action', key: 'delete' },
];

const format = str => moment(str).format('YYYY-MM-DD HH:mm');

const i18n = str => ({
  topic_type: '文章',
  activity_type: '活动',
})[str];

const originLink = (type, id) => ({
  topic_type: `http://www.geekpark.net/topics/${id}`,
  activity_type: `http://events.geekpark.net/activities/${id}`,
})[type];

const transData = d => d.map(x => {
  const action = <a href="javascript:;">删除</a>;
  const content_type = <a href={originLink(x.content_type, x.redirect)} target="_blank">{i18n(x.content_type)}</a>;

  return {
    ...x,
    action,
    content_type,
    send_at: format(x.send_at || x.created_at),
    created_at: format(x.created_at),
  };
});

class BroadcastsIndex extends React.Component {
  static contextTypes = {
    server: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super();

    this.state = {
      pagination: { total: context.server.broadcasts_count },
      data: transData(context.server.broadcasts),
    };
  }

  handleTableChange(pagination) {
    const { current } = pagination;

    fetchBroadcasts({ page: current })
      .done(data => {
        this.setState({ data });
      })
      .fail(jqXHR => {
        alert('Error', jqXHR.responseText);
      });
  }

  render() {
    return (
      <div className="panel-wrap">
        <div className="panel-title">推送列表</div>
        <div className="panel-content">
          <Table
            dataSource={transData(this.state.data)} columns={columns}
            pagination={this.state.pagination} onChange={::this.handleTableChange}
          />
        </div>
      </div>
    );
  }
}

export default BroadcastsIndex;
