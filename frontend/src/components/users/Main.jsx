import React, { PropTypes } from 'react';

const permitProps = props => ({
  server: props.server,
  dispatch: props.dispatch,
});

const Wrapper = props => (
  <section className={`section ${props.className}`}>
    <div className="section-title padding">{props.title}</div>
    <div className="section-desc">{props.desc}</div>
    <div className={`section-content ${props.isCenter ? 'center' : ''} ${props.needPadding ? 'padding' : ''}`}>
      {
        React.cloneElement(props.children, { ...permitProps(props) })
      }
    </div>
  </section>
);

Wrapper.defaultProps = {
  title: '账户安全',
};

Wrapper.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  children: PropTypes.element,
  className: PropTypes.string,
  isCenter: PropTypes.bool,
  needPadding: PropTypes.bool,
};

export default Wrapper;
