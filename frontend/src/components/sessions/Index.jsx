import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import ReduxWrapper from '../ReduxWrapper';
import Transition from '../Transition';
import Wrapper from './Wrapper';
import Login from './Login';
import Register from './Register';
import ResetPassword from './ResetPassword';

const T = props => (
  <ReduxWrapper>
    <Transition {...props}>
      <Wrapper children={props.children} />
    </Transition>
  </ReduxWrapper>
);

T.propTypes = { children: PropTypes.element.isRequired };

class Session extends React.Component {
  render() {
    return (
      <div>
        <Router history={browserHistory}>
          <Route path="/" component={T}>
            <IndexRoute component={Login} />
            <Route path="login" component={Login} />
            <Route path="signup" component={Register} />
            <Route path="reset" component={ResetPassword} />
          </Route>
        </Router>
      </div>
    );
  }
}

export default Session;
