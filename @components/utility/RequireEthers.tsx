import React, { PropsWithChildren, ReactElement } from 'react';
import { useEthers } from '@app';
import { Card } from 'antd';
import { MetamaskConnect } from '@components/auth';

const defaultMessage = 'You need to be connected to Ethereum network.';

interface Props {
  message?: string;
  showMessage?: boolean;
}

export function RequireEthers({
  showMessage = true,
  message = defaultMessage,
  children,
}: PropsWithChildren<Props>): ReactElement {
  const { connected } = useEthers();

  if (!connected) {
    if (showMessage) {
      return (
        <Card title="Ethereum required">
          <p>{message}</p>
          <MetamaskConnect />
        </Card>
      );
    } else {
      return null;
    }
  } else {
    return <>{children}</>;
  }
}
