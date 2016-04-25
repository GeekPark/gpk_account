import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import ReduxWrapper from '../ReduxWrapper';
import Transition from '../Transition';
import Wrapper from './Wrapper';
import Login from './Login';
import Register from './Register';
import ResetPassword from './ResetPassword';
import Modal from '../Modal';

const T = props => (
  <ReduxWrapper>
    <div>
      <Transition {...props}>
        <Wrapper children={props.children} />
      </Transition>
      <Modal />
    </div>
  </ReduxWrapper>
);

T.propTypes = { children: PropTypes.element.isRequired };

class Session extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={T}>
          <IndexRoute component={Login} />
          <Route path="login" component={Login} />
          <Route path="signup" component={Register} />
          <Route path="reset" component={ResetPassword} />
        </Route>
      </Router>
    );
  }
}

export default Session;
