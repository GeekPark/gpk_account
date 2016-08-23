import React, { PropTypes } from 'react';

import BroadcastsIndex from './broadcasts/Index';

import Layout from './Layout';

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
    return (
      <div className="app">
        <Layout server={this.props.server}>
          <BroadcastsIndex />
        </Layout>
      </div>
    );
  }
}

export default App;
