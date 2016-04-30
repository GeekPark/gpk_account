import React, { PropTypes } from 'react';

class Tooltip extends React.Component {
  constructor() {
    super();

    this.state = {
      isShow: false,
      msg: '',
    };

    this.postErr = msg => {
      this.setState({ isShow: true, msg });
    };

    this.clear = () => this.setState({ isShow: false });

    this.isTooltip = true;
  }

  render() {
    const { children, className } = this.props;
    const { msg, isShow } = this.state;
    return (
      <div className={`tooltip-wrapper direction-right ${className}`}>
        {children}
        <span className={`tooltip-message status-error ${isShow ? 'show' : ''}`}>
          {msg}
        </span>
      </div>
    );
  }
}

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};

export default Tooltip;
