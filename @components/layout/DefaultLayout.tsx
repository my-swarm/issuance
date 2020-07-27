import React, { ReactNode, useState } from 'react';
import { Button, Layout, PageHeader } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { PageProps } from '@types';
import { Logo, MetamaskStatus } from '@components';
import { MainMenu } from '@components/layout/MainMenu';

const { Content, Sider } = Layout;

interface DefaultLayoutProps extends PageProps {
  headExtra?: ReactNode;
  headTableAligned: boolean;
}

export function DefaultLayout({ title, headExtra, children, headTableAligned = false }: DefaultLayoutProps) {
  const [siderCollapsed, setSiderCollapsed] = useState(false);

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
        <MainMenu />
        <div style={{ padding: '.5rem' }}>
          <MetamaskStatus />
        </div>
      </Sider>
      <Content>
        <PageHeader
          title={title}
          backIcon={false}
          extra={headExtra}
          className={headTableAligned ? `table-aligned` : ``}
        />
        {children}
      </Content>
    </Layout>
  );
}
