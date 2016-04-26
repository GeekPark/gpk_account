import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

class Message extends React.Component {
  render() {
    const { message } = this.props;
    const { isShow, msgType, msg } = message;
    return (
      <div className={`message-wrapper ${isShow ? 'show' : ''} status-${msgType}`}>
        <i className={`iconfont icon-${msgType}`}></i>
        <div className="message-content">
          {msg}
        </div>
      </div>
    );
  }
}

Message.propTypes = {
  message: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({ ...state });

export default connect(mapStateToProps)(Message);
