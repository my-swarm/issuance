import React, { ReactElement } from 'react';
import Link from 'next/link';
import { Logo, MainMenu, MetamaskStatus, StateStorageSync } from '@components';
import { Divider, Layout, Space } from 'antd';
import { MailOutlined } from '../../@lib/icons';

interface Props {
  fullUi: boolean;
}

export function Sidebar({ fullUi = false }: Props): ReactElement {
  return (
    <>
      {fullUi && (
        <Link href="/">
          <a>
            <Logo />
          </a>
        </Link>
      )}
      <MainMenu />
      <Divider />
      <div className="side-box mt-4">
        <MetamaskStatus />
      </div>
      <div className="side-box mt-4">
        <StateStorageSync />
      </div>
      <div className="side-box mt-4">
        <h3 className="side-box-title">
          <Space>
            <MailOutlined />
            <span>Get in touch</span>
          </Space>
        </h3>
        <div className="side-box-body">
          <div className="mb-2">
            <a href="mailto:info@myswarm.app">info@myswarm.app</a>
          </div>
          <div>
            <a href="https://t.me/joinchat/G8Tp9xgq2FpCSuKs6W4IXg" target="_blank" rel="noreferrer noopener">
              telegram
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
