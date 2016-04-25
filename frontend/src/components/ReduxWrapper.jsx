import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducers from 'reducers/index';

const store = createStore(reducers, {},
  window.devToolsExtension ? window.devToolsExtension() : undefined
);

const ReduxWrapper = props => (
  <Provider store={store}>
    {props.children}
  </Provider>
);

ReduxWrapper.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ReduxWrapper;
