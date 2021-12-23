import React, { PropsWithChildren, ReactElement } from 'react';
import { useEthers } from '@app';
import { Alert } from 'antd';
import { networkNames } from '@lib';
import { RequireEthers } from './RequireEthers';

interface Props {
  showMessage?: boolean;
}

export function RequireCorrectNetwork({ children }: PropsWithChildren<Props>): ReactElement {
  const { connected, networkId } = useEthers();

  if (!connected || !networkId) {
    return <RequireEthers showMessage={true} />;
  }
  const isAllowed = !!networkNames[networkId];
  if (isAllowed) return <>{children}</>;

  return (
    <Alert
      className="mb-4"
      type="error"
      showIcon={true}
      message="Unsupported Network"
      description={
        <>
          You are connected to Chain ID {networkId} which is not supported by this App.
          <br />
          Supported networks:{' '}
          <strong>
            {Object.values(networkNames)
              .filter((x) => x !== 'Local')
              .join(', ')}
          </strong>
          .
        </>
      }
    />
  );
}
