import React, { ReactElement } from 'react';
import { Space } from 'antd';
import { MailOutlined } from '../../@lib/icons';

export function SidebarContacts(): ReactElement {
  return (
    <>
      <h3 className="side-box-title">
        <Space>
          <MailOutlined />
          <span>Get in touch</span>
        </Space>
      </h3>
      <div className="side-box-body">
        <div className="mb-1">
          <a href="mailto:info@myswarm.app">info@myswarm.app</a>
        </div>
        <div>
          <a href="https://t.me/joinchat/G8Tp9xgq2FpCSuKs6W4IXg" target="_blank" rel="noreferrer noopener">
            telegram
          </a>
        </div>
      </div>
    </>
  );
}
