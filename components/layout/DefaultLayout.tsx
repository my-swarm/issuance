import React, { useState } from 'react';
import { Button, Card, Layout, Menu } from 'antd';
import { AppstoreOutlined, DashboardOutlined, UserOutlined } from '@ant-design/icons';
import { Logo, Address, MetamaskConnect } from '..';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { EthersContext, Status } from '../../context/EthersContext';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
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
        <div style={{ padding: '.5rem' }}>
          <EthersContext.Consumer>
            {({ status, address, connect, disconnect }) => {
              console.log('consumer init', { status });
              // if (status === Status.DISCONNECTED) {
              //   connect(true);
              // }
              let cardTitle, cardBody;
              switch (status) {
                case Status.DISCONNECTED:
                  cardTitle = 'Disconnected';
                  cardBody = <MetamaskConnect label="Connect now" />;
                  break;
                case Status.CONNECTED:
                  cardTitle = 'Connceted';
                  cardBody = (
                    <div>
                      your address:
                      <br />
                      {address ? <Address>{address}</Address> : 'unknown address'}
                    </div>
                  );
                  break;
                case Status.FAILED:
                  cardTitle = 'Failed';
                  cardBody = 'Failed to connect. Make sure you have Metamask installed';
                  break;
              }
              return (
                <Card size="small" title={cardTitle}>
                  {cardBody}
                </Card>
              );
            }}
          </EthersContext.Consumer>
        </div>
      </Sider>
      <Content>{children}</Content>
    </Layout>
  );
}
