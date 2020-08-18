import React from 'react';
import { ethers } from 'ethers';
import { Button } from 'antd';

import { Metamask } from '@lib';
import { EthersContext, useEthers } from '@app';

interface MetamaskConnectProps {
  label: string;
}

export function MetamaskConnect({ label = 'Connect with Metamask' }: MetamaskConnectProps) {
  const { connect, address } = useEthers();

  if (!connect) {
    return null;
  }

  const handleConnect = () => {
    if (address) {
      // already connected
      return;
    }
    connect(false);
  };

  return (
    <Button
      onClick={handleConnect}
      className="c-metamask-connect-button"
      icon={<img src="/images/metamask-fox.svg" alt="Metamask icon" />}
    >
      {address ? 'Already connected' : label}
    </Button>
  );
}
