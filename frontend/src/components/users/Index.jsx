import React, { PropTypes } from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';

import ReduxWrapper from '../ReduxWrapper';
import Message from '../share/Message';
import ServerStore from '../share/ServerStore';

import Wrapper from './Wrapper';

import BasicInfo from './BasicInfo';
import Third from './Third';

import SecurityIndex from './security/Index';
import NeedIdentify from './security/NeedIdentify';

import EmailEdit from './security/EmailEdit';
import EmailBind from './security/EmailBind';

import MobileEdit from './security/MobileEdit';
import MobileBind from './security/MobileBind';

import PasswordEdit from './security/PasswordEdit';

import TFABind from './security/TFABind';

const T = props => (
  <ReduxWrapper>
    <div>
      <ServerStore server={props.route.server} />
      <Message />
      <Wrapper children={props.children} />
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
        <Route path="password">
          <Route path="edit" component={PasswordEdit} />
        </Route>
        <Route component={NeedIdentify}>
          <Route path="email">
            <IndexRoute component={EmailEdit} />
            <Route path="bind" component={EmailBind} />
          </Route>
          <Route path="mobile">
            <IndexRoute component={MobileEdit} />
            <Route path="bind" component={MobileBind} />
          </Route>
        </Route>
        <Route path="2fa">
          <Route path="bind" component={TFABind} />
        </Route>
      </Route>
      <Route path="third">
        <IndexRoute component={Third} />
      </Route>
    </Route>
  </Router>
);

export default User;
