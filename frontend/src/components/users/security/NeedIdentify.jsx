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
  children: PropTypes.element,
};

export default NeedIdentify;
