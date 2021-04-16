import React, { ReactElement, useMemo } from 'react';
import { useEthers } from '@app';
import { getNetworkName } from '@lib';
import { Alert } from 'antd';

export function NetworkNote(): ReactElement {
  const { networkId } = useEthers();

  const hostname = window.location.hostname;
  let siteNetwork = 'unknown';
  if (hostname === 'kovan.myswarm.app') {
    siteNetwork = 'kovan';
  } else if (hostname === 'myswarm.app') {
    siteNetwork = 'mainnet';
  } else if (hostname === 'app.myswarm.l') {
    siteNetwork = 'local';
  }
  const connectedNetwork = useMemo(() => (networkId ? getNetworkName(networkId) : undefined), [networkId]);

  if (connectedNetwork && connectedNetwork !== siteNetwork) {
    return (
      <Alert
        className="mb-4"
        type="error"
        showIcon={true}
        message="You are connected to a wrong network"
        description={
          <>
            The app running on <b>{hostname}</b> expects you to be connected to <b>{siteNetwork}</b>, where you are
            actually connected to <b>{connectedNetwork}.</b>
          </>
        }
      />
    );
  } else {
    return null;
  }
}
