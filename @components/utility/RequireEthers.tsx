import React, { ReactElement } from 'react';
import { useEthers } from '@app';
import { Card } from 'antd';
import { MetamaskConnect } from '@components/auth';

const defaultMessage = 'You need to be connected to Ethereum network to proceed.';

export function RequireEthers({ children = null, message = defaultMessage }): ReactElement {
  const { connected } = useEthers();

  if (!connected) {
    return (
      <Card title="Ethereum required">
        <p>{message}</p>
        <MetamaskConnect />
      </Card>
    );
  }

  return children;
}
