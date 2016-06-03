import React, { PropTypes } from 'react';

class SubscribeItem extends React.Component {
  render() {
    const { name, buttonText, onClick } = this.props;
    return (
      <div className="form-button-group">
        <div className="left-label">
          <span className="label-text">
            {name}
          </span>
        </div>
        <a onClick={onClick} className="form-button">{buttonText}</a>
      </div>
    );
  }
}

SubscribeItem.propTypes = {
  name: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SubscribeItem;
