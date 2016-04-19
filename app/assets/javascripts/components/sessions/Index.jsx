import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Wrapper from './Wrapper';
import Login from './Login.jsx';
import Register from './Register.jsx';

class Session extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Wrapper}>
          <IndexRoute component={Login} />
          <Route path="login" component={Login} />
          <Route path="register" component={Register} />
        </Route>
      </Router>
    );
  }
}

export default Session;
