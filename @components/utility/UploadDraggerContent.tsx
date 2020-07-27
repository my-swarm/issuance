import React, { ReactElement } from 'react';
import { InboxOutlined } from '@ant-design/icons/lib';
import { Space } from 'antd';

interface UploadDraggerContentProps {
  hint?: string;
}

export function UploadDraggerContent({ hint }: UploadDraggerContentProps): ReactElement {
  return (
    <>
      <Space align="center">
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file here</p>
      </Space>
      {hint && <p className="ant-upload-hint">{hint}</p>}
    </>
  );
}
