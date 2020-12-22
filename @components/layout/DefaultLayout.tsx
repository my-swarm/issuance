import React, { ReactNode, useEffect, useState } from 'react';
import { Layout, PageHeader, Modal, Space } from 'antd';
import Head from 'next/head';
import Link from 'next/link';

import {
  Logo,
  MetamaskStatus,
  StateStorageSync,
  TransactionModal,
  SpendingApprovalModal,
  MainMenu,
  Footer,
} from '@components';
import { isDev, useAppState } from '@app';
import { MailOutlined } from '@ant-design/icons';

const { Content, Sider } = Layout;

interface PageProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  description?: string;
}

interface DefaultLayoutProps extends PageProps {
  headExtra?: ReactNode;
  headTableAligned?: boolean;
}

export function DefaultLayout({ title, headExtra, children, headTableAligned = false }: DefaultLayoutProps) {
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const [{ error, transaction, spendingApproval }, dispatch] = useAppState();

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

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <Sider trigger={null} collapsible collapsed={siderCollapsed}>
        <Link href="/">
          <a>
            <Logo />
          </a>
        </Link>
        <MainMenu />
        <div className="side-box mt-4">
          <MetamaskStatus />
        </div>
        {isDev && (
          <div className="side-box mt-4">
            <StateStorageSync />
          </div>
        )}
        <div className="side-box mt-4">
          <h3 className="side-box-title">
            <Space>
              <MailOutlined />
              <span>Contact us</span>
            </Space>
          </h3>
          <div className="side-box-body">
            <div className="mb-2">
              email:
              <br />
              <a href="mailto:info@myswarm.app">info@myswarm.app</a>
            </div>
            <div>
              telegram:
              <br />
              <a href="#">xxxxxx</a>
            </div>
          </div>
        </div>
      </Sider>
      <Content>
        <div className="content-content">
          <PageHeader
            title={title}
            backIcon={false}
            extra={headExtra}
            className={headTableAligned ? `table-aligned` : ``}
          />
          {children}
        </div>
        <div className="content-footer">
          <Footer />
        </div>
        {transaction && <TransactionModal />}
        {spendingApproval && <SpendingApprovalModal />}
      </Content>
    </Layout>
  );
}
