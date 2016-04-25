import React, { PropTypes } from 'react';

const PasswordInput = props => (
  <div className={`form-group ${props.className}`}>
    <input type="text" placeholder={props.placeholder} />
    <div className="form-side">
      <i className="iconfont icon-eye"></i>
    </div>
  </div>
);

PasswordInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default PasswordInput;
