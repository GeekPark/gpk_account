import React, { PropTypes } from 'react';
import { Table } from 'antd';

const columns = [
  { title: '类型', dataIndex: 'content_type', key: 'content_type' },
  { title: '内容', dataIndex: 'content', key: 'content' },
  { title: '创建时间', dataIndex: 'created_at', key: 'created_at' },
  { title: '发送时间', dataIndex: 'send_at', key: 'send_at' },
  { title: '操作', dataIndex: 'action', key: 'delete' },
];

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

  return { ...x, action, content_type };
});

class BroadcastsIndex extends React.Component {
  static contextTypes = {
    server: PropTypes.object.isRequired,
  }

  render() {
    const { broadcasts } = this.context.server;

    return (
      <div className="panel-wrap">
        <div className="panel-title">推送列表</div>
        <div className="panel-content">
          <Table dataSource={transData(broadcasts)} columns={columns} />
        </div>
      </div>
    );
  }
}

export default BroadcastsIndex;
