import React, { PropTypes } from 'react';
import { Form, Radio, Input, Select, Col, Button } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

import OriginSearchInput from './OriginSearchInput';

const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 7 },
};

const Field = props => (
  <FormItem {...formItemLayout} {...props}>
    {props.children}
  </FormItem>
);

Field.propTypes = { children: PropTypes.any };

const showError = (isShow, props) => (
  isShow ? props : {}
);

class New extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
  }

  constructor() {
    super();

    this.state = {
      searchError: false,
      searchType: 'initial',
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    alert('submit');
  }

  selectType(value) {
    if (value !== 'initial') this.setState({ searchError: false });
    this.setState({ searchType: value });
  }

  showSelectTypeError() {
    this.setState({ searchError: true });
  }

  render() {
    const { getFieldProps } = this.props.form;
    const { searchError } = this.state;

    return (
      <div className="panel-wrap">
        <div className="panel-title">创建消息</div>
        <div className="panel-content">
          <Form horizontal onSubmit={::this.handleSubmit}>
            <Field label="消息类型">
              <RadioGroup {...getFieldProps('content_type', { initialValue: 'topic' })}>
                <Radio value="topic">文章推送</Radio>
                <Radio value="activity">活动推送</Radio>
              </RadioGroup>
            </Field>

            <Field label="消息内容">
              <Input type="textarea" {...getFieldProps('content', { initialValue: '' })} />
            </Field>

            <Field label="关联内容">
              <Col span={6}>
                <FormItem {...showError(searchError, { validateStatus: 'error', help: '请选择类型' })}>
                  <Select defaultValue="initial" onChange={::this.selectType}>
                    <Option value="initial">类型选择</Option>
                    <Option value="topic">文章</Option>
                    <Option value="activity">活动</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={17} offset={1}>
                <FormItem>
                  <OriginSearchInput type={this.state.searchType} showError={::this.showSelectTypeError} />
                </FormItem>
              </Col>
            </Field>

            <Field label="发送时间">
              <RadioGroup {...getFieldProps('time', { initialValue: '' })}>
                <Radio value="">即时发送</Radio>
                <Radio value="123">定时发送</Radio>
              </RadioGroup>
            </Field>

            <div className="panel-btns">
              <Col span={10} offset={2}>
                <Button type="primary">发送</Button>
                <Button>取消</Button>
              </Col>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(New);
