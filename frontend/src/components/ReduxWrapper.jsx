import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';

import reducers from '../reducers/index';

const store = createStore(reducers, {}, compose(
  applyMiddleware(ReduxThunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

const ReduxWrapper = props => (
  <Provider store={store}>
    {props.children}
  </Provider>
);

ReduxWrapper.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ReduxWrapper;
