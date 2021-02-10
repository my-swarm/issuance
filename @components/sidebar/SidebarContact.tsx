import React, { ReactElement } from 'react';
import { SideBox } from '../utility';
import { Space } from 'antd';
import { MailOutlined } from '../../@lib/icons';

export function SidebarContact(): ReactElement {
  return (
    <SideBox>
      <h3 className="title">
        <Space>
          <MailOutlined />
          <span>Get in touch</span>
        </Space>
      </h3>
      <div className="body">
        <div className="mb-1">
          <a href="mailto:info@myswarm.app">info@myswarm.app</a>
        </div>
        <div>
          <a href="https://t.me/joinchat/G8Tp9xgq2FpCSuKs6W4IXg" target="_blank" rel="noreferrer noopener">
            telegram
          </a>
        </div>
      </div>
    </SideBox>
  );
}
