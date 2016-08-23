/* eslint import/no-unresolved: 0 */

import $ from 'jquery';
import React, { PropTypes } from 'react';
import { render } from './share/utils';

import Layout from './components/admin/Layout';

// apply antd style
require('style!css!antd/dist/antd.min.css');

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
          <div>
            首页
          </div>
        </Layout>
      </div>
    );
  }
}

$(() => {
  render(App, document.querySelector('#app'));
});
