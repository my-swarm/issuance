import React, { ReactElement } from 'react';
import { useContract, useEthers } from '@app';
import { EthereumNetwork } from '@lib';
import { Alert } from 'antd';

export function UniswapWidget(): ReactElement {
  const { swm } = useContract();
  const { networkId } = useEthers();
  const allowedNetwork = networkId === EthereumNetwork.Kovan || networkId === EthereumNetwork.Main;
  if (!swm || !allowedNetwork)
    return <Alert type="info" message={`No trading widget availabe for network ${networkId}`} />;

  return (
    <iframe
      className="uniswap-widget"
      src={`https://app.uniswap.org/#/swap?theme=dark&outputCurrency=${swm.address}`}
      height="660px"
      width="100%"
    />
  );
}
