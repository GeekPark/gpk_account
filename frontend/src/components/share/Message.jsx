import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import { showMessage } from '../../actions';

class Message extends React.Component {
  componentWillMount() {
    // const server = this.props.server;
    // let msg;
    // if (typeof server === 'object' && Array.isArray(server.errors)) {
    //   msg = server.errors[0];
    // }
    //
    // if (msg) this.props.dispatch(showMessage({ type: 'error', msg }));
  }
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
