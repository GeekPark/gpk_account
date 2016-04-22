import React, { PropTypes } from 'react';

const PasswordInput = props => (
  <div className="form-group">
    <input type="text" placeholder={props.placeholder} />
    <div className="form-side">
      <i className="iconfont icon-eye"></i>
    </div>
  </div>
);

PasswordInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
};

export default PasswordInput;
