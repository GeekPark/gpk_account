import React, { PropTypes } from 'react';

class Tooltip extends React.Component {
  render() {
    const { children, className, info } = this.props;
    const { msg, type, isShow } = info;
    return (
      <div className={`tooltip-wrapper ${className}`}>
        {children}
        <span className={`tooltip-message status-${type} ${isShow ? 'show' : ''}`}>
          {msg}
        </span>
      </div>
    );
  }
}

Tooltip.propTypes = {
  info: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};

export default Tooltip;
