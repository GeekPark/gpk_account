import $ from 'jquery';
import React from 'react';
import { render } from 'react-dom';
import Session from './components/sessions/Index';
// import Modal from './components/Modal';

$(() => {
  render(<Session />, $('#component-session').get(0));
  // render(<Modal />, document.querySelector('#modal'));
});
