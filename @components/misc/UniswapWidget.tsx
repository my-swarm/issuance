import React, { ReactElement } from 'react';
import { useContract, useEthers } from '@app';
import { EthereumNetwork, exchanges } from '@lib';
import { Alert, Card } from 'antd';
import { addresses } from '../../@contracts';

export function UniswapWidget(): ReactElement {
  const { networkId } = useEthers();
  const allowedNetwork = networkId === EthereumNetwork.Polygon || networkId === EthereumNetwork.Main;
  if (!allowedNetwork) return <Alert type="info" message={`No trading widget availabe for network ${networkId}`} />;

  const swmAddress = addresses[networkId].SwmToken;
  const exchangeUrl = exchanges[networkId];

  if (networkId === 137) {
    return (
      <Card title="Trade SWM">
        <p>Trading widget not available for Polygon.</p>
        <p>
          <a href={`${exchangeUrl}outputCurrency=${swmAddress}`} target="_blank" rel="noopener noreferrer">
            Trade SWM on QuickSwap
          </a>
        </p>
      </Card>
    );
  }

  return (
    <iframe className="uniswap-widget" src={`${exchangeUrl}outputCurrency=${swmAddress}`} height="660px" width="100%" />
  );
}
