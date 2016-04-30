import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import ReduxWrapper from '../ReduxWrapper';
import Transition from '../share/Transition';
import Wrapper from './Wrapper';
import Login from './Login';
import Register from './Register';
import ResetPassword from './reset_password/Index';
import Modal from '../Modal';
import Message from '../share/Message';
import ServerStore from '../share/ServerStore';

const T = props => (
  <ReduxWrapper>
    <div>
      <ServerStore server={props.route.server} />
      <Transition {...props}>
        <Wrapper children={props.children} />
      </Transition>
      <Modal />
      <Message />
    </div>
  </ReduxWrapper>
);

T.propTypes = {
  route: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

const Session = props => (
  <Router history={browserHistory}>
    <Route path="/" component={T} {...props}>
      <IndexRoute component={Login} />
      <Route path="login" component={Login} />
      <Route path="signup" component={Register} />
      <Route path="reset_password" component={ResetPassword} />
    </Route>
  </Router>
);

Session.propTypes = {
  server: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
  ]),
};

export default Session;
