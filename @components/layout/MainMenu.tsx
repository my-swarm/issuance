import React, { ReactElement } from 'react';
import Link from 'next/link';
import { Menu, Tag } from 'antd';
import {
  AppstoreOutlined,
  DollarCircleOutlined,
  UserOutlined,
  LineChartOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';

export function MainMenu(): ReactElement {
  const router = useRouter();

  return (
    <Menu theme="dark" mode="inline" defaultOpenKeys={['investor', 'issuer']} defaultSelectedKeys={[router.pathname]}>
      <Menu.SubMenu key="investor" title={<span>Investor</span>} icon={<UserOutlined />} popupOffset={[16, 0]}>
        <Menu.Item key="/invest" icon={<DollarCircleOutlined />}>
          <Link href="/invest">
            <a>Invest</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="/wallet" icon={<WalletOutlined />}>
          <Link href="/wallet">
            <a>Wallet</a>
          </Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="issuer" title="Token Issuer" icon={<UserOutlined />}>
        <Menu.Item key="/tokens" icon={<AppstoreOutlined />}>
          <Link href="/tokens">
            <a>Tokens</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="/fundraisers" icon={<LineChartOutlined />}>
          <Link href="/fundraisers">
            <a>Fundraisers</a>
          </Link>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
}
