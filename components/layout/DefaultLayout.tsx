import React, { useState } from 'react';
import { Button, Card, Layout, Menu, PageHeader } from 'antd';
import { AppstoreOutlined, DashboardOutlined, UserOutlined } from '@ant-design/icons';
import { Logo, Address, MetamaskConnect, MetamaskStatus } from '..';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { EthersContext, Status } from '../../app/EthersContext';
import { PageProps } from '../../types';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

interface DefaultLayoutProps extends PageProps {
  headExtra?: React.ReactNode;
}

export function DefaultLayout({ title, headExtra, children }: DefaultLayoutProps) {
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const router = useRouter();

  function renderLogoutLink(disconnect: () => void) {
    return (
      <Button size="small" onClick={() => disconnect()}>
        disconnect
      </Button>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <Sider trigger={null} collapsible collapsed={siderCollapsed}>
        <Logo />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[router.pathname]}>
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
          <Menu.Item key="/account" icon={<UserOutlined />}>
            <Link href="/account">
              <a>My Account</a>
            </Link>
          </Menu.Item>
        </Menu>
        <div style={{ padding: '.5rem' }}>
          <MetamaskStatus />
        </div>
      </Sider>
      <Content>
        <PageHeader title={title} extra={headExtra} />
        {children}
      </Content>
    </Layout>
  );
}
