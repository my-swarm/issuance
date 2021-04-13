import React, { ReactElement } from 'react';
import { useContract } from '@app';

export function UniswapWidget(): ReactElement {
  const { swm, networkId } = useContract();
  if (!swm) return null;

  return (
    <iframe
      className="uniswap-widget"
      src={`https://app.uniswap.org/#/swap?theme=dark&outputCurrency=${swm.address}`}
      height="660px"
      width="100%"
    />
  );
}
