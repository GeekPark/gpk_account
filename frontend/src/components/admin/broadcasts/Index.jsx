import React, { PropTypes } from 'react';

class BroadcastsIndex extends React.Component {
  static contextTypes = {
    server: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div className="panel-wrap">
        <div className="panel-title">推送列表</div>
        共有{this.context.server.broadcasts.length}条结果
      </div>
    );
  }
}

export default BroadcastsIndex;
