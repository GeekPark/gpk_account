import React, { PropTypes } from 'react';
import { Motion, spring, presets } from 'react-motion';
import { isMobileView } from 'mdetect';
import scrollTo from 'jquery-scroll';

const EFFECT = presets.stiff;

class Tooltip extends React.Component {
  constructor() {
    super();

    this.state = {
      isShow: false,
      msg: '',
    };

    this.postErr = msg => {
      this.setState({ isShow: true, msg });
      if (isMobileView()) {
        setTimeout(() => {
          scrollTo({
            selector: '.tooltip-message.status-error.show',
            offset: 60,
          });
        }, 300);
      }
    };

    this.clear = () => this.setState({ isShow: false });

    this.isTooltip = true;
  }

  render() {
    const { children, className } = this.props;
    const { msg, isShow } = this.state;
    const isRight = !isMobileView();
    return (
      <div className={`tooltip-wrapper direction-${isRight ? 'right' : 'top'} ${className}`}>
        {children}
        <Motion defaultStyle={{ op: 0, offset: 15 }}
          style={{ op: spring(isShow ? 1 : 0, EFFECT), offset: spring(isShow ? 0 : 15, EFFECT) }}
        >
          { s => (
            <span className={`tooltip-message status-error ${isShow ? 'show' : ''}`}
              style={{ opacity: s.op, transform: isRight ? `translateX(${115 - s.offset}%)` : `translateY(${s.offset}px)` }}
            >
              {msg}
            </span>
          )}
        </Motion>
      </div>
    );
  }
}

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};

export default Tooltip;
