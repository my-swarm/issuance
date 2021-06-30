import React, { PropsWithChildren, ReactElement } from 'react';
import { useEthers } from '@app';
import { Card } from 'antd';
import { supportedNetworks } from '@lib';
import { RequireEthers } from './RequireEthers';

const defaultMessage = 'Please connect to Main Ethereum Network (or Kovan for testing).';

interface Props {
  message?: string;
  showMessage?: boolean;
}

export function RequireCorrectNetwork({
  showMessage = true,
  message = defaultMessage,
  children,
}: PropsWithChildren<Props>): ReactElement {
  const { connected, networkId } = useEthers();

  if (!connected) {
    return <RequireEthers showMessage={showMessage} />;
  }
  if (supportedNetworks.indexOf(networkId) === -1) {
    if (showMessage) {
      return (
        <Card title="Etherem Mainnet required">
          <p>{message}</p>
        </Card>
      );
    } else {
      return null;
    }
  }
  return <>{children}</>;
}
