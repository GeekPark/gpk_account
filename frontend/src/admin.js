/* eslint import/no-unresolved: 0 */

import $ from 'jquery';
import React from 'react';
import { render } from './share/utils';

import LeftMenu from './components/admin/LeftMenu';

// apply antd style
require('style!css!antd/dist/antd.min.css');

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <LeftMenu />
      </div>
    );
  }
}

$(() => {
  render(App, document.querySelector('#app'));
});
