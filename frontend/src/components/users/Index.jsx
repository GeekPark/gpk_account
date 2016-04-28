import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import ReduxWrapper from '../ReduxWrapper';
import Transition from '../share/Transition';
import Message from '../share/Message';
import ServerStore from '../share/ServerStore';

import Wrapper from './Wrapper';

import BasicInfo from './BasicInfo';

const T = props => (
  <ReduxWrapper>
    <div>
      <ServerStore server={props.route.server} />
      <Message />
      <Transition {...props}>
        <Wrapper children={props.children} />
      </Transition>
    </div>
  </ReduxWrapper>
);

T.propTypes = {
  route: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

const User = props => (
  <Router history={browserHistory}>
    <Route path="/" component={T} {...props}>
      <IndexRoute component={BasicInfo} />
    </Route>
  </Router>
);

export default User;
