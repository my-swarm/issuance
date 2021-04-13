import React from 'react';
import { CoinIcon } from './CoinIcon';

interface Props {
  token: {
    name: string;
    symbol: string;
  };
}

export function TokenTitle({ token }: Props) {
  const { name, symbol } = token;

  return (
    <span>
      <CoinIcon name={symbol} /> <span>{symbol}</span>
    </span>
  );
}
