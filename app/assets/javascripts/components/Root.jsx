import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';

const Nav = () => (
  <header>
    <Link to="/">singin</Link>
    <br />
    <Link to="signup">singup</Link>
  </header>
);

const SignIn = () => (
  <div>
    <Nav />
    <h1>SignIn</h1>
  </div>
);

const SignUp = () => (
  <div>
    <Nav />
    <h1>SignUp</h1>
  </div>
);

class Root extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={SignIn} />
        <Route path="signup" component={SignUp} />
      </Router>
    );
  }
}

export default Root;
