import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import reduceRight from 'lodash/reduceRight';

import reducers from 'reducers/index';

const store = createStore(reducers, {}, reduceRight(
  applyMiddleware(ReduxThunk),
  window.devToolsExtension ? window.devToolsExtension() : undefined
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
