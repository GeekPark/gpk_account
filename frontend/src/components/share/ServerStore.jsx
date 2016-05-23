import React, { PropTypes } from 'react';
import { setStore } from '../../actions';
import { connect } from 'react-redux';

class ServerStore extends React.Component {
  componentWillMount() {
    this.props.dispatch(setStore(this.props.server));
  }
  render() {
    return this.props.children;
  }
}

ServerStore.propTypes = {
  server: PropTypes.any,
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

const mapStateToProps = (state, ownProps) => ({ ...state, ...ownProps });
export default connect(mapStateToProps)(ServerStore);
