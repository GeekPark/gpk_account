import React, { PropTypes } from 'react';
import { Select } from 'antd';

const Option = Select.Option;

class OriginSearchInput extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    showError: PropTypes.func.isRequired,
  }

  constructor(props) {
    super();

    this.state = {
      data: [
        {
          text: '123',
          value: '123',
        },
      ],
      value: '',
      focus: false,
      type: props.type,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) this.setState({ type: nextProps.type });
  }

  handleChange(value) {
    this.setState({ value });
    if (this.state.type === 'initial') this.props.showError();
  }

  render() {
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
    return (
      <div style={{ width: '100%' }}>
        <Select
          size="large"
          combobox
          value={this.state.value}
          notFoundContent=""
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onChange={::this.handleChange}
        >
          {options}
        </Select>
      </div>
    );
  }
}

export default OriginSearchInput;
