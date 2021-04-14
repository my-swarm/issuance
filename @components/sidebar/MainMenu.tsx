import React, { ReactElement } from 'react';
import Link from 'next/link';
import { Menu } from 'antd';
import {
  AppstoreOutlined,
  DashboardOutlined,
  DollarCircleOutlined,
  InfoCircleOutlined,
  WalletOutlined,
} from '@lib/icons';
import { useRouter } from 'next/router';

export function MainMenu(): ReactElement {
  const router = useRouter();

  return (
    <Menu mode="inline" defaultOpenKeys={['investor', 'issuer']} defaultSelectedKeys={[router.pathname]}>
      <Menu.Item key="/" icon={<DashboardOutlined />}>
        <Link href="/">
          <a>Dashboard</a>
        </Link>
      </Menu.Item>{' '}
      <Menu.Item key="/contribute" icon={<DollarCircleOutlined />}>
        <Link href="/contribute">
          <a>Contribute</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="/wallet" icon={<WalletOutlined />}>
        <Link href="/wallet">
          <a>Wallet</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="/tokens" icon={<AppstoreOutlined />}>
        <Link href="/tokens">
          <a>Manage Tokens</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="about" icon={<InfoCircleOutlined />}>
        <a href="https://www.swarmnetwork.org/" target="_blank" rel="noreferrer noopener">
          About
        </a>
      </Menu.Item>
    </Menu>
  );
}
