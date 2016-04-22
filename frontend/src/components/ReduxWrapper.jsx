import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducers from 'reducers/index';

const store = createStore(reducers, {},
  window.devToolsExtension ? window.devToolsExtension() : undefined
);

const ReduxWrapper = props => (
  <div>
    <Provider store={store}>
      {props.children}
    </Provider>
  </div>
);

ReduxWrapper.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ReduxWrapper;
