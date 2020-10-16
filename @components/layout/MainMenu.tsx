import React, { ReactElement } from 'react';
import Link from 'next/link';
import { Menu } from 'antd';
import { AppstoreOutlined, DashboardOutlined, UserOutlined, LineChartOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

export function MainMenu(): ReactElement {
  const router = useRouter();

  return (
    <Menu theme="dark" mode="inline" defaultSelectedKeys={[router.pathname]}>
      <Menu.Item key="/test" icon={<DashboardOutlined />}>
        <Link href="/test">
          <a>Test</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="/" icon={<DashboardOutlined />}>
        <Link href="/">
          <a>Dashboard</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="/tokens" icon={<AppstoreOutlined />}>
        <Link href="/tokens">
          <a>My Tokens</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="/fundraisers" icon={<LineChartOutlined />}>
        <Link href="/fundraisers">
          <a>My Fundraisers</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="/account" icon={<UserOutlined />}>
        <Link href="/account">
          <a>My Account</a>
        </Link>
      </Menu.Item>
    </Menu>
  );
}
