import React, { ReactElement } from 'react';
import { useContract, useEthers } from '@app';
import { EthereumNetwork } from '@lib';
import { Alert } from 'antd';
import { addresses } from '../../@contracts';

export function UniswapWidget(): ReactElement {
  const { networkId } = useEthers();
  const allowedNetwork = networkId === EthereumNetwork.Kovan || networkId === EthereumNetwork.Main;
  if (!allowedNetwork) return <Alert type="info" message={`No trading widget availabe for network ${networkId}`} />;

  const swmAddress = addresses[networkId].SwmToken;

  return (
    <iframe
      className="uniswap-widget"
      src={`https://app.uniswap.org/#/swap?theme=dark&outputCurrency=${swmAddress}`}
      height="660px"
      width="100%"
    />
  );
}
