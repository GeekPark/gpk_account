import React, { PropTypes } from 'react';

import BroadcastsIndex from './broadcasts/Index';
import BroadcastsNew from './broadcasts/New';

import Layout from './Layout';

const components = {
  'broadcasts/index': BroadcastsIndex,
  'broadcasts/new': BroadcastsNew,
};

class App extends React.Component {
  static propTypes = {
    server: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    server: PropTypes.object.isRequired,
  }

  getChildContext() {
    return { server: this.props.server };
  }

  render() {
    const { controller, action } = this.props.server;
    const Child = components[`${controller}/${action}`];

    return (
      <div className="app">
        <Layout server={this.props.server}>
          <Child />
        </Layout>
      </div>
    );
  }
}

export default App;
