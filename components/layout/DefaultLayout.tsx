import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { AppstoreOutlined, UserOutlined, DashboardOutlined } from '@ant-design/icons';
import { Logo } from './Logo';
import Link from 'next/link';
import { useRouter } from 'next/router';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const router = useRouter();
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={siderCollapsed}>
        <Logo />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[router.pathname]}>
          <Menu.Item key="/" icon={<DashboardOutlined />}>
            <Link href="/">
              <a>Dashboard</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="/my-tokens" icon={<AppstoreOutlined />}>
            <Link href="/my-tokens">
              <a>My Tokens</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="/my-account" icon={<UserOutlined />}>
            <Link href="/my-account">
              <a>My Account</a>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Content>{children}</Content>
    </Layout>
  );
}
