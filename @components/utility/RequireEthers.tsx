import React, { ReactElement } from 'react';
import { useEthers } from '@app';
import { Card } from 'antd';
import { MetamaskConnect } from '@components/auth';

export function RequireEthers({ children }): ReactElement {
  const { connected } = useEthers();

  if (!connected) {
    return (
      <Card title="Ethereum required">
        <p>You need to be connected to Ethereum network to proceed.</p>
        <MetamaskConnect />
      </Card>
    );
  }

  return children;
}
