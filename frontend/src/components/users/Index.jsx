import React, { PropTypes } from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';

import ReduxWrapper from '../ReduxWrapper';
import Message from '../share/Message';
import ServerStore from '../share/ServerStore';

import Wrapper from './Wrapper';

import BasicInfo from './BasicInfo';
import Third from './Third';

import SecurityIndex from './security/Index';
import SecurityEmail from './security/Email';

const T = props => (
  <ReduxWrapper>
    <div>
      <ServerStore server={props.route.server} />
      <Message />
      <Wrapper children={props.children} {...props} />
    </div>
  </ReduxWrapper>
);

T.propTypes = {
  route: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

const User = props => (
  <Router history={hashHistory}>
    <Route component={T} {...props}>
      <Route path="/" component={BasicInfo} />
      <Route path="security">
        <IndexRoute component={SecurityIndex} />
        <Route path="email" component={SecurityEmail} />
      </Route>
      <Route path="third" component={Third} />
    </Route>
  </Router>
);

export default User;
