import React, { PropTypes } from 'react';
import { permit } from '../../share/utils';

const Main = props => (
  <section className={`section ${props.className}`}>
    <div className="section-title padding">{props.title}</div>
    {
      props.desc === undefined ? null :
        <div className="section-desc" dangerouslySetInnerHTML={{ __html: props.desc }} />
    }
    <div className={`section-content ${props.isCenter ? 'center' : ''} ${props.needPadding ? 'padding' : ''}`}>
      {
        React.cloneElement(props.children, { ...permit(props, ['server', 'dispatch', 'verify_code']) })
      }
    </div>
  </section>
);

Main.defaultProps = {
  title: '帐户安全',
};

Main.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  className: PropTypes.string,
  isCenter: PropTypes.bool,
  needPadding: PropTypes.bool,
  children: PropTypes.element,
};

export default Main;
