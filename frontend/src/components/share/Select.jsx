import React, { PropTypes } from 'react';

class Select extends React.Component {
  render() {
    const props = this.props;
    return (
      <span className={`select-wrapper ${props.className}`}>
        <select defaultValue={props.value} name={props.name} ref="select" disabled={props.disabled} onChange={props.onChange}>
          {
            props.options.map((v, i) => (
              <option key={i} value={v[0]}>{v[1]}</option>
            ))
          }
        </select>
      </span>
    );
  }
}

Select.defaultProps = {
  disabled: false,
  className: '',
};

Select.propTypes = {
  options: PropTypes.array.isRequired,
  name: PropTypes.string,
  value: PropTypes.any,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

export default Select;
