import $ from 'jquery';
import React from 'react';
import { render } from 'react-dom';
import Session from './components/sessions/Index';

console.log('er1');

$(() => {
  render(<Session />, $('#component-session').get(0));
});
