import React, { PropTypes } from 'react';
import { RouteTransition, presets } from 'react-router-transition';

const Transition = (props) => (
  <RouteTransition
    component={false}
    className="transition-wrapper"
    pathname={props.location.pathname}
    {...presets.pop}
  >
    {props.children}
  </RouteTransition>
);

Transition.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired,
};

export default Transition;
