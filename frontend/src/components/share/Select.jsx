import React, { PropTypes } from 'react';

const Select = props => (
  <span className="select-wrapper">
    <select defaultValue={props.value} name={props.name}>
      {
        props.options.map((v, i) => (
          <option key={i} value={v[0]}>{v[1]}</option>
        ))
      }
    </select>
  </span>
);

Select.propTypes = {
  options: PropTypes.array,
  name: PropTypes.string,
  value: PropTypes.any,
};

export default Select;
