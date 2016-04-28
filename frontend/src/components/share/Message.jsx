import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { showMessage, setStore, clearMessage } from '../../actions';

class Message extends React.Component {
  constructor() {
    super();

    this.clear = () => {
      this.props.dispatch(clearMessage());
    };
  }
  componentWillMount() {
    const { server, dispatch } = this.props;
    let msg;
    if (typeof server === 'object' && server !== null && Array.isArray(server.errors)) {
      msg = server.errors[0];
    }

    // dispaly first error message from server side, then delete server errors
    if (msg) {
      dispatch(showMessage({ type: 'error', msg }));
      dispatch(setStore({ ...server, errors: [] }));
    }
  }
  render() {
    const { message } = this.props;
    const { isShow, msgType, msg } = message;
    return (
      <div className={`component-wrapper ${isShow ? 'show' : ''} status-${msgType}`} onClick={this.clear}>
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
  server: PropTypes.any,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ ...state });

export default connect(mapStateToProps)(Message);
