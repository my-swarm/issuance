import React, { PropsWithChildren } from 'react';
import { Space } from 'antd';

export function SwmHeader({ children }: PropsWithChildren<unknown>) {
  return (
    <h2 className="mt-3 mb-3">
      <Space>
        <img src="/images/swarm-symbol.svg" alt="Swarm symbol" className="h-4 w-a" />
        <span>{children}</span>
      </Space>
    </h2>
  );
}
