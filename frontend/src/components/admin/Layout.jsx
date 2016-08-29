import React, { PropTypes } from 'react';
import { Menu, Icon } from 'antd';

const { SubMenu } = Menu;

const navItems = list => list.map(x => <Menu.Item key={x.path}>
  <a href={x.path}>{x.title}</a>
</Menu.Item>);

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  }

  static contextTypes = {
    server: PropTypes.object.isRequired,
  }

  render() {
    const { action, controller, routes } = this.context.server;
    const actionPath = action === 'index' ? '' : `/${action}`;

    return (
      <div className="ant-layout-aside">
        <aside className="ant-layout-sider">
          <a className="ant-layout-logo" href="/admin/"></a>
          <Menu
            mode="inline" theme="dark"
            defaultSelectedKeys={[`/admin/${controller}${actionPath}`]}
            defaultOpenKeys={[controller]}
          >
            <SubMenu key="broadcasts" title={<span><Icon type="notification" />通知中心</span>}>
              {navItems(routes.broadcasts)}
            </SubMenu>
          </Menu>
        </aside>
        <div className="ant-layout-main">
          <div className="ant-layout-container">
            <div className="ant-layout-content">
              {this.props.children}
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

export default Layout;
