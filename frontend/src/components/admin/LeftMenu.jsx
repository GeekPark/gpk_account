import React from 'react';
import { Menu, Icon, Breadcrumb } from 'antd';

const { SubMenu } = Menu;

class LeftMenu extends React.Component {
  render() {
    return (
      <div className="ant-layout-aside">
        <aside className="ant-layout-sider">
          <div className="ant-layout-logo">
          </div>
          <Menu mode="inline" theme="dark" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}>
            <SubMenu key="sub1" title={<span><Icon type="notification" />通知中心</span>}>
              <Menu.Item key="1">通知列表</Menu.Item>
              <Menu.Item key="2">新增通知</Menu.Item>
            </SubMenu>
          </Menu>
        </aside>
        <div className="ant-layout-main">
          <div className="ant-layout-breadcrumb">
            <Breadcrumb>
              <Breadcrumb.Item>首页</Breadcrumb.Item>
              <Breadcrumb.Item>通知中心</Breadcrumb.Item>
              <Breadcrumb.Item>通知列表</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ant-layout-container">
            <div className="ant-layout-content">
              <div style={{ height: 590 }}>
                内容区域
              </div>
            </div>
          </div>
          <div className="ant-layout-footer">
            GeekPark &copy; 用户中心
          </div>
        </div>
      </div>
    );
  }
}

export default LeftMenu;
