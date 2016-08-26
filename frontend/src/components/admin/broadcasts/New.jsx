import React, { PropTypes } from 'react';
import { Form, Radio, Input, Select, Col, Button, DatePicker, message } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

import OriginSearchInput from './OriginSearchInput';
import { createBroadcast } from '../../../share/server';

const formItemLayout = {
  labelCol: { lg: 3, md: 4 },
  wrapperCol: { lg: 8, md: 8 },
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

  static contextTypes = {
    server: PropTypes.object.isRequired,
  }

  constructor() {
    super();

    this.state = {
      searchError: false,
      searchType: 'initial',
      sendNow: '1',
      isLoading: false,
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    const { getFieldsValue } = this.props.form;

    const { content_type, redirect, content, send_at } = getFieldsValue();

    if (content_type === 'initial') {
      alert('请选择类型');
      return;
    }

    if (redirect === undefined || redirect.length === 0) {
      alert('请填写需要关联的内容');
      return;
    }

    if (content === undefined || content.length === 0) {
      alert('请填写消息内容');
      return;
    }

    if (send_at === undefined) {
      if (!confirm('确定要立即发送通知吗')) return;
    }

    this.setState({ isLoading: true });

    createBroadcast({
      content_type: `${content_type}_type`,
      content,
      redirect,
      send_at: $('.ant-calendar-range-picker').val(),
    })
      .done(d => {
        message.success('添加成功，自动跳转中...');
        setTimeout(() => {
          window.location.href = d.redirect;
        }, 2000);
      })
      .fail(jqXHR => {
        console.error('出错啦', jqXHR.responseText);
      })
      .always(() => {
        ::this.setState({ isLoading: false });
      });
  }

  selectType(value) {
    if (value !== 'initial') this.setState({ searchError: false });
    this.setState({ searchType: value });
  }

  showSelectTypeError() {
    this.setState({ searchError: true });
  }

  selectTime(e) {
    this.setState({ sendNow: e.target.value });
  }

  goBack() {
    window.location.href = this.context.server.routes.broadcasts[0].path;
  }

  render() {
    const { getFieldProps } = this.props.form;
    const { searchError } = this.state;

    return (
      <div className="panel-wrap">
        <div className="panel-title">创建消息</div>
        <div className="panel-content">
          <Form horizontal onSubmit={::this.handleSubmit}>
            <Field label="关联内容" required>
              <Col span={6}>
                <FormItem {...showError(searchError, { validateStatus: 'error', help: '请选择类型' })}>
                  <Select
                    {...getFieldProps('content_type', {
                      initialValue: 'initial',
                      onChange: ::this.selectType,
                    })}
                  >
                    <Option value="initial">类型选择</Option>
                    <Option value="topic">文章</Option>
                    <Option value="activity">活动</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={17} offset={1}>
                <OriginSearchInput
                  type={this.state.searchType}
                  showError={::this.showSelectTypeError}
                  getFieldProps={getFieldProps}
                />
              </Col>
            </Field>

            <Field label="消息内容" required>
              <Input type="textarea" {...getFieldProps('content')} />
            </Field>

            <Field label="发送时间" required>
              <RadioGroup value={this.state.sendNow} onChange={::this.selectTime}>
                <Radio value="1">即时发送</Radio>
                <Radio value="0">定时发送</Radio>
              </RadioGroup>
              <DatePicker
                showTime
                disabled={this.state.sendNow === '1'}
                style={{ marginRight: '15px' }}
                format="yyyy-MM-dd HH:mm:ss"
                {...getFieldProps('send_at')}
              />
            </Field>

            <div className="panel-btns">
              <Col span={10} offset={3}>
                <Button
                  type="primary" onClick={::this.handleSubmit}
                  loading={this.state.isLoading}
                  disabled={this.state.isLoading}
                >发送</Button>
                <Button onClick={::this.goBack}>取消</Button>
              </Col>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(New);
