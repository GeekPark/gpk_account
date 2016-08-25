import React, { PropTypes } from 'react';
import isUUID from 'validator/lib/isUUID';
import { Form, Select } from 'antd';

const FormItem = Form.Item;

import { searchOrigin } from '../../../share/server';

const Option = Select.Option;

class OriginSearchInput extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    showError: PropTypes.func.isRequired,
    getFieldProps: PropTypes.func.isRequired,
  }

  constructor(props) {
    super();

    this.state = {
      data: [],
      value: '',
      focus: false,
      type: props.type,
      isLoading: false,
      selected: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) this.setState({ type: nextProps.type });
  }

  handleChange(value) {
    this.setState({ value });
    if (this.state.type === 'initial') {
      this.props.showError();
      return;
    }

    if (value.length === 0 || isUUID(value, 4) || /^\d{6}$/.test(value)) return;

    this.setState({ isLoading: true, selected: '' });
    searchOrigin({ type: this.state.type, key: value })
      .then(data => this.setState({ data, isLoading: false }));
  }

  handleSelect(e) {
    const item = this.state.data.filter(x => x.value === +e)[0];
    this.setState({ selected: item.text });
  }

  render() {
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
    return (
      <FormItem
        validateStatus={this.state.isLoading ? 'validating' : ''}
        hasFeedback help={this.state.selected} required
      >
        <div style={{ width: '100%' }}>
          <Select
            size="large"
            combobox
            value={this.state.value}
            notFoundContent=""
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSelect={::this.handleSelect}
            {...this.props.getFieldProps('redirect_id', {
              onChange: ::this.handleChange,
            })}
          >
            {options}
          </Select>
        </div>
      </FormItem>
    );
  }
}

export default OriginSearchInput;
