import React, { ReactNode, useEffect, useState } from 'react';
import { Button, Layout, PageHeader, Modal } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { PageProps } from '@types';
import { Logo, MetamaskStatus, TransactionModal } from '@components';
import { MainMenu } from '@components/layout/MainMenu';
import { useAppState } from '@app';

const { Content, Sider } = Layout;

interface DefaultLayoutProps extends PageProps {
  headExtra?: ReactNode;
  headTableAligned?: boolean;
}

export function DefaultLayout({ title, headExtra, children, headTableAligned = false }: DefaultLayoutProps) {
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const [{ error, transaction }, dispatch] = useAppState();

  useEffect(() => {
    if (error) {
      Modal.error({
        title: error.message,
        content: typeof error.description === 'string' ? <p>{error.description}</p> : error.description,
        onOk: () => {
          dispatch({ type: 'hideError' });
        },
      });
    }
  }, [error]);

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
        {transaction && <TransactionModal />}
      </Content>
    </Layout>
  );
}
