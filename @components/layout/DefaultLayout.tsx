import React, { ReactNode, useEffect, useState } from 'react';
import { Layout, PageHeader, Modal, Space, Divider, Button, Drawer, Row, Col } from 'antd';
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
import { MailOutlined, MenuOutlined, CloseOutlined } from '@lib/icons';
import { Sidebar } from './Sidebar';

const { Header, Content, Sider } = Layout;

interface PageProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
}

interface DefaultLayoutProps extends PageProps {
  headExtra?: ReactNode;
  headTableAligned?: boolean;
}

export function DefaultLayout({ title, headExtra, children, headTableAligned = false }: DefaultLayoutProps) {
  const [{ error, transaction, spendingApproval }, dispatch] = useAppState();
  const [hasMobileMenu, setHasMobileMenu] = useState(false);

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

  const toggleMobileMenu = () => {
    setHasMobileMenu(!hasMobileMenu);
  };

  return (
    <Layout>
      <Head>
        <title>{title || 'My Swarm'}</title>
      </Head>
      <Header>
        <Row justify="space-between">
          <Col span={12}>
            <Button icon={<MenuOutlined />} type="primary" ghost onClick={toggleMobileMenu} />
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Logo />
          </Col>
        </Row>
      </Header>
      <Layout>
        <Sider trigger={null} breakpoint="lg" collapsedWidth={0}>
          <Sidebar fullUi />
        </Sider>
        <Content>
          <div className="content-content">
            {title && (
              <PageHeader
                title={title}
                backIcon={false}
                extra={headExtra}
                className={headTableAligned ? `table-aligned` : ``}
              />
            )}
            {children}
          </div>
          <div className="content-footer">
            <Footer />
          </div>
          {transaction && <TransactionModal />}
          {spendingApproval && <SpendingApprovalModal />}
          <Drawer
            width={200}
            placement="left"
            visible={hasMobileMenu}
            onClose={() => setHasMobileMenu(false)}
            className="with-sidebar"
            closeIcon={<Button icon={<CloseOutlined />} type="primary" ghost />}
          >
            <Sidebar />
          </Drawer>
        </Content>
      </Layout>
    </Layout>
  );
}
