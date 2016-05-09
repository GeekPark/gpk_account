import React, { PropTypes } from 'react';

import { isIdentified } from '../../../share/server';
import Identify from './Identify';

class NeedIdentify extends React.Component {
  constructor() {
    super();

    this.state = {
      loaded: false,
      showIdentify: null,
    };
  }
  componentWillMount() {
    const { email, mobile, is_old } = this.props.server.user;
    // for is_old true user,
    if (/email/.test(this.props.location.pathname) && is_old) {
      this.setState({ loaded: true, showIdentify: false });
      return;
    }
    // for SNS user
    if (email === null && mobile === null) {
      this.setState({ loaded: true, showIdentify: false });
      return;
    }
    isIdentified().then(
      () => {
        this.setState({ loaded: true, showIdentify: false });
      },
      () => {
        this.setState({ loaded: true, showIdentify: true });
      }
    );
  }
  render() {
    let result = null;
    if (this.state.loaded && this.state.showIdentify) result = <Identify { ...this.props } />;
    if (this.state.loaded && this.state.showIdentify === false) result = React.cloneElement(this.props.children, { ...this.props });
    return result;
  }
}

NeedIdentify.propTypes = {
  server: PropTypes.object,
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired,
};

export default NeedIdentify;
