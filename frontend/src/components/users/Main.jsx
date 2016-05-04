import React, { PropTypes } from 'react';

const permitProps = props => ({
  server: props.server,
  dispatch: props.dispatch,
  verify_code: props.verify_code,
});

const Wrapper = props => (
  <section className={`section ${props.className}`}>
    <div className="section-title padding">{props.title}</div>
    {
      props.desc === undefined ? null :
      <div className="section-desc" dangerouslySetInnerHTML={{ __html: props.desc }} />
    }
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
  className: PropTypes.string,
  isCenter: PropTypes.bool,
  needPadding: PropTypes.bool,
  children: PropTypes.element,
};

export default Wrapper;
