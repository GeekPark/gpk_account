/* eslint import/no-unresolved: 0 */

import $ from 'jquery';
import { render } from './share/utils';

import App from './components/admin/App';

// apply antd style
require('style!css!antd/dist/antd.min.css');

$(() => {
  render(App, document.querySelector('#app'));
});
