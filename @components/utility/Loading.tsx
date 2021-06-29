import React, { ReactElement } from 'react';
import { LoadingOutlined } from '@lib/icons';
import { Space } from 'antd';
import { Box } from './Box';

interface Props {
  message: string;
}

export function Loading({ message = 'Loading' }: Props): ReactElement {
  return (
    <div className="mb-3">
      <Box subtle>
        <Space>
          <LoadingOutlined />
          {`${message}...`}
        </Space>
      </Box>
    </div>
  );
}
